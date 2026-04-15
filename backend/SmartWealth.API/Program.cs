using System.Data;
using System.Text;
using Dapper;
using Hangfire;
using Hangfire.SqlServer;
using Resend;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SmartWealth.API.Repositories;
using SmartWealth.API.Services;
using SmartWealth.API.Workers;
using StackExchange.Redis;

// Dapper TypeHandler：讓 DateOnly 可以正常對應 SQL DATE 欄位
SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo
    {
        Title = "SmartWealth API",
        Version = "v1",
        Description = "The Private Ledger — 個人財富管理系統後端 API"
    });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.ParameterLocation.Header,
        Description = "輸入 JWT Token（不需加 Bearer 前綴）"
    });
    c.AddSecurityRequirement(_ => new Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        { new Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", null), [] }
    });
});

// CORS — 允許前端 SPA 存取
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT 認證
var crunchy_jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("缺少 Jwt:Secret 設定");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(crunchy_jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// MemoryCache — 用於 OAuth state CSRF 驗證 & 密碼重設 token
builder.Services.AddMemoryCache();

// Resend — 寄信服務
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["Resend:ApiKey"]
        ?? throw new InvalidOperationException("缺少 Resend:ApiKey 設定");
});
builder.Services.AddTransient<IResend, ResendClient>();

// DI — Repositories & Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IHoldingRepository, HoldingRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Redis：建立單一 IConnectionMultiplexer（Singleton），供 CachedPriceService 使用
// abortConnect=false 代表 Redis 連不上時不拋例外，API 仍可啟動（會自動退化為直接打 Yahoo）
var redisConnStr = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379,abortConnect=false";
builder.Services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisConnStr));

// Google OAuth — 用於 Token 交換與 UserInfo 查詢
builder.Services.AddHttpClient("Google");

// 股價服務：YahooPriceService 透過 HttpClient 直接打外部 API
//           CachedPriceService 包在外層，優先查 Redis，Cache Miss 才委派給 YahooPriceService
builder.Services.AddHttpClient<YahooPriceService>();
builder.Services.AddSingleton<IPriceService, CachedPriceService>();

// 背景服務：每 15 分鐘自動刷新所有持倉的現價
builder.Services.AddHostedService<PriceRefreshWorker>();

// Hangfire — 月報排程
var crunchy_hangfireConn = builder.Configuration.GetConnectionString("SmartWealth")!;
builder.Services.AddHangfire(cfg => cfg
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(crunchy_hangfireConn, new SqlServerStorageOptions
    {
        CommandBatchMaxTimeout       = TimeSpan.FromMinutes(5),
        SlidingInvisibilityTimeout   = TimeSpan.FromMinutes(5),
        QueuePollInterval            = TimeSpan.Zero,
        UseRecommendedIsolationLevel = true,
        DisableGlobalLocks           = true
    }));
builder.Services.AddHangfireServer();
builder.Services.AddScoped<IMonthlyReportService, MonthlyReportService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartWealth API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Hangfire Dashboard（僅開發環境開放）
if (app.Environment.IsDevelopment())
{
    app.UseHangfireDashboard("/hangfire");
}

// 每月 1 日 08:00 發送月報（Server 本地時間）
RecurringJob.AddOrUpdate<IMonthlyReportService>(
    recurringJobId: "monthly-report",
    methodCall: svc => svc.SendMonthlyReportsAsync(),
    cronExpression: "0 8 1 * *"
);

app.Run();

// ── 型別定義（必須在 top-level statements 之後）──────────────────────────
class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
{
    public override void SetValue(IDbDataParameter parameter, DateOnly value)
    {
        parameter.DbType = DbType.Date;
        parameter.Value = value.ToDateTime(TimeOnly.MinValue);
    }

    public override DateOnly Parse(object value) =>
        DateOnly.FromDateTime((DateTime)value);
}
