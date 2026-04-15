using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using Resend;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Services;

public class AuthService(
    IUserRepository userRepository,
    IConfiguration configuration,
    IMemoryCache memoryCache,
    IHttpClientFactory httpClientFactory,
    IResend resend) : IAuthService
{
    // ── Email / Password ──────────────────────────────────────────────────────

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await userRepository.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Email 或密碼錯誤");

        // 純 Google 帳號沒有密碼，提示使用者改用 Google 登入
        if (string.IsNullOrEmpty(user.PasswordHash))
            throw new UnauthorizedAccessException("此帳號使用 Google 登入，請點擊「Google 登入」按鈕");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email 或密碼錯誤");

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var exists = await userRepository.ExistsAsync(request.Email);
        if (exists)
            throw new InvalidOperationException("此 Email 已被註冊");

        var crunchy_passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email        = request.Email,
            PasswordHash = crunchy_passwordHash,
            FullName     = request.FullName
        };

        user.UserId = await userRepository.CreateAsync(user);

        return BuildAuthResponse(user);
    }

    // ── Forgot / Reset Password ───────────────────────────────────────────────

    public async Task RequestPasswordResetAsync(string crunchy_email)
    {
        // 找使用者（不存在也不報錯，避免 Email enumeration 攻擊）
        var user = await userRepository.GetByEmailAsync(crunchy_email);
        if (user == null) return;

        // 純 Google 帳號沒有密碼，無法重設
        if (string.IsNullOrEmpty(user.PasswordHash)) return;

        // 生成 token 並存入 MemoryCache（15 分鐘有效）
        var crunchy_token = Guid.NewGuid().ToString("N");
        memoryCache.Set($"pwd_reset_{crunchy_token}", user.UserId, TimeSpan.FromMinutes(15));

        var crunchy_frontendOrigin = configuration["Cors:AllowedOrigin"] ?? "http://localhost:5500";
        var crunchy_resetLink = $"{crunchy_frontendOrigin}/#/reset-password?token={crunchy_token}";

        var crunchy_fromEmail = configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";

        var message = new EmailMessage
        {
            From    = crunchy_fromEmail,
            Subject = "重設您的 The Private Ledger 密碼"
        };
        message.To.Add(crunchy_email);
        message.HtmlBody = $@"
            <div style=""font-family:Inter,sans-serif;background:#131313;color:#e5e2e1;padding:40px 24px;max-width:480px;margin:0 auto;"">
                <h1 style=""font-size:22px;font-weight:800;margin-bottom:8px;"">The Private Ledger</h1>
                <p style=""color:#c5c6cd;margin-bottom:24px;"">您好 {user.FullName}，我們收到了您的密碼重設請求。</p>
                <a href=""{crunchy_resetLink}"" style=""display:inline-block;background:linear-gradient(135deg,#bbc6e2,#1b263b);color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;"">重設密碼</a>
                <p style=""color:#8f9097;font-size:13px;margin-top:24px;"">此連結將在 15 分鐘後失效。若您未提出此請求，請忽略此郵件。</p>
            </div>";

        await resend.EmailSendAsync(message);
    }

    public async Task ResetPasswordAsync(string crunchy_token, string crunchy_newPassword)
    {
        var crunchy_cacheKey = $"pwd_reset_{crunchy_token}";

        if (!memoryCache.TryGetValue(crunchy_cacheKey, out int userId_carrot))
            throw new InvalidOperationException("重設連結無效或已過期");

        var crunchy_passwordHash = BCrypt.Net.BCrypt.HashPassword(crunchy_newPassword);
        await userRepository.UpdatePasswordAsync(userId_carrot, crunchy_passwordHash);

        memoryCache.Remove(crunchy_cacheKey); // 一次性使用
    }

    // ── Google OAuth ──────────────────────────────────────────────────────────

    /// <summary>
    /// 生成 Google 授權 URL，並將 state 存入 MemoryCache（10 分鐘有效）防止 CSRF。
    /// </summary>
    public string GetGoogleLoginUrl()
    {
        var crunchy_clientId    = configuration["Google:ClientId"]    ?? throw new InvalidOperationException("Google:ClientId 未設定");
        var crunchy_redirectUri = configuration["Google:RedirectUri"] ?? throw new InvalidOperationException("Google:RedirectUri 未設定");

        // 生成 state（CSRF token）
        var crunchy_state = Guid.NewGuid().ToString("N");
        memoryCache.Set($"oauth_state_{crunchy_state}", true, TimeSpan.FromMinutes(10));

        var queryParams = new Dictionary<string, string>
        {
            ["client_id"]     = crunchy_clientId,
            ["redirect_uri"]  = crunchy_redirectUri,
            ["response_type"] = "code",
            ["scope"]         = "openid email profile",
            ["state"]         = crunchy_state,
            ["access_type"]   = "offline",
            ["prompt"]        = "select_account"
        };

        var crunchy_queryString = string.Join("&",
            queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));

        return $"https://accounts.google.com/o/oauth2/v2/auth?{crunchy_queryString}";
    }

    /// <summary>
    /// 驗證 state → 用 code 換 access_token → 取得 Google UserInfo → 找/建使用者 → 回傳 JWT。
    /// </summary>
    public async Task<AuthResponse> HandleGoogleCallbackAsync(string crunchy_code, string crunchy_state)
    {
        // 1. 驗證 state（CSRF 防護）
        var crunchy_stateKey = $"oauth_state_{crunchy_state}";
        if (!memoryCache.TryGetValue(crunchy_stateKey, out _))
            throw new UnauthorizedAccessException("OAuth state 無效或已過期");

        memoryCache.Remove(crunchy_stateKey); // 一次性使用

        // 2. 用 code 換 Google access_token
        var crunchy_accessToken = await ExchangeCodeForAccessTokenAsync(crunchy_code);

        // 3. 用 access_token 取得 Google 使用者資訊
        var (crunchy_googleId, crunchy_email, crunchy_name) = await GetGoogleUserInfoAsync(crunchy_accessToken);

        // 4. 找到或建立使用者（含帳號連結）
        var user = await userRepository.FindOrCreateGoogleUserAsync(crunchy_googleId, crunchy_email, crunchy_name);

        return BuildAuthResponse(user);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private async Task<string> ExchangeCodeForAccessTokenAsync(string crunchy_code)
    {
        var crunchy_clientId     = configuration["Google:ClientId"]     ?? throw new InvalidOperationException("Google:ClientId 未設定");
        var crunchy_clientSecret = configuration["Google:ClientSecret"] ?? throw new InvalidOperationException("Google:ClientSecret 未設定");
        var crunchy_redirectUri  = configuration["Google:RedirectUri"]  ?? throw new InvalidOperationException("Google:RedirectUri 未設定");

        var httpClient = httpClientFactory.CreateClient("Google");

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"]    = "authorization_code",
            ["code"]          = crunchy_code,
            ["redirect_uri"]  = crunchy_redirectUri,
            ["client_id"]     = crunchy_clientId,
            ["client_secret"] = crunchy_clientSecret
        });

        var res = await httpClient.PostAsync("https://oauth2.googleapis.com/token", content);

        if (!res.IsSuccessStatusCode)
        {
            var crunchy_errBody = await res.Content.ReadAsStringAsync();
            throw new UnauthorizedAccessException($"Google Token 交換失敗 {crunchy_errBody}");
        }

        var crunchy_json = await res.Content.ReadAsStringAsync();
        using var doc    = JsonDocument.Parse(crunchy_json);
        return doc.RootElement.GetProperty("access_token").GetString()
            ?? throw new UnauthorizedAccessException("Google 回應缺少 access_token");
    }

    private async Task<(string Id, string Email, string Name)> GetGoogleUserInfoAsync(string crunchy_accessToken)
    {
        var httpClient = httpClientFactory.CreateClient("Google");
        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", crunchy_accessToken);

        var crunchy_json = await httpClient.GetStringAsync("https://www.googleapis.com/oauth2/v2/userinfo");

        using var doc = JsonDocument.Parse(crunchy_json);
        var root = doc.RootElement;

        var crunchy_id    = root.GetProperty("id").GetString()    ?? throw new InvalidOperationException("Google UserInfo 缺少 id");
        var crunchy_email = root.GetProperty("email").GetString() ?? throw new InvalidOperationException("Google UserInfo 缺少 email");
        var crunchy_name  = root.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? crunchy_email : crunchy_email;

        return (crunchy_id, crunchy_email, crunchy_name);
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var crunchy_token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Success = true,
            Token   = crunchy_token,
            User    = new UserDto
            {
                UserId   = user.UserId,
                Email    = user.Email,
                FullName = user.FullName
            }
        };
    }

    private string GenerateJwtToken(User user)
    {
        var crunchy_secret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT Secret 未設定");

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(crunchy_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiry_carrot = int.Parse(configuration["Jwt:ExpiryHours"] ?? "24");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email,           user.Email),
            new Claim(ClaimTypes.Name,            user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer:             configuration["Jwt:Issuer"],
            audience:           configuration["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(expiry_carrot),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
