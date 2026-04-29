using System.Text.Json;
using Azure.Messaging.ServiceBus;
using SmartWealth.API.Models.Events;
using SmartWealth.API.Repositories;
using SmartWealth.API.Services;

namespace SmartWealth.API.Workers;

/// <summary>
/// 背景服務：每 15 分鐘自動刷新所有使用者的持倉現價，並檢查股價預警條件。
/// 流程：查出全部 Holdings → 去重 symbol → 透過 CachedPriceService 取得報價
///       → 逐筆更新 DB → 比對預警條件 → 觸發者丟進 Service Bus Queue。
/// </summary>
public class PriceRefreshWorker(
    IServiceProvider services,
    ServiceBusClient? serviceBusClient,
    IConfiguration configuration,
    ILogger<PriceRefreshWorker> logger) : BackgroundService
{
    // 自動刷新間隔，與 Redis TTL 一致：15 分鐘
    private static readonly TimeSpan RefreshInterval = TimeSpan.FromMinutes(15);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("PriceRefreshWorker 啟動，每 {Minutes} 分鐘自動刷新股價",
            RefreshInterval.TotalMinutes);

        // PeriodicTimer 是 .NET 6+ 推薦的定時器，支援 CancellationToken，應用程式關閉時能乾淨停止
        using var timer = new PeriodicTimer(RefreshInterval);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await RefreshAllPricesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                // 單次刷新失敗不中斷 Worker，下一個週期繼續執行
                logger.LogError(ex, "股價自動刷新發生錯誤，將於下次週期重試");
            }
        }
    }

    private async Task RefreshAllPricesAsync(CancellationToken stoppingToken)
    {
        // BackgroundService 是 Singleton，不能直接注入 Scoped 服務（IHoldingRepository）。
        // 需建立獨立的 DI Scope，在 Scope 內解析 Scoped 服務後再釋放。
        await using var scope = services.CreateAsyncScope();
        var holdingRepo  = scope.ServiceProvider.GetRequiredService<IHoldingRepository>();
        var priceService = scope.ServiceProvider.GetRequiredService<IPriceService>();
        var alertRepo    = scope.ServiceProvider.GetRequiredService<IPriceAlertRepository>();
        var userRepo     = scope.ServiceProvider.GetRequiredService<IUserRepository>();

        // 1. 取得系統內全部 Holdings（跨所有使用者）
        var holdings = (await holdingRepo.GetAllAsync()).ToList();
        if (holdings.Count == 0)
        {
            logger.LogInformation("目前無任何 Holdings，跳過此次刷新");
            return;
        }

        // 2. 去除重複 symbol，避免同一檔股票打多次 Yahoo Finance
        var distinctPairs = holdings
            .GroupBy(h => h.Symbol)
            .Select(g => (Symbol: g.Key, AssetType: g.First().AssetType))
            .ToList();

        var symbols    = distinctPairs.Select(p => p.Symbol);
        var assetTypes = distinctPairs.Select(p => p.AssetType);

        // 3. 批次取得報價（CachedPriceService 自動處理 Redis Cache）
        var prices = await priceService.GetPricesAsync(symbols, assetTypes);

        // 4. 依據最新報價逐筆更新 DB
        int updated_carrot = 0;
        foreach (var holding in holdings)
        {
            if (!prices.TryGetValue(holding.Symbol, out var price)) continue;
            await holdingRepo.UpdatePriceAsync(holding.HoldingId, holding.UserId, price);
            updated_carrot++;
        }

        logger.LogInformation(
            "股價刷新完成 — 共更新 {Updated} 筆 Holdings，涵蓋 {Symbols} 個不同 symbol",
            updated_carrot, prices.Count);

        // 5. 比對預警條件，觸發者丟入 Service Bus Queue
        await CheckPriceAlertsAsync(alertRepo, userRepo, prices, stoppingToken);
    }

    private async Task CheckPriceAlertsAsync(
        IPriceAlertRepository alertRepo,
        IUserRepository userRepo,
        IDictionary<string, decimal> prices,
        CancellationToken stoppingToken)
    {
        if (serviceBusClient is null) return;

        var activeAlerts = (await alertRepo.GetAllActiveAsync()).ToList();
        if (activeAlerts.Count == 0) return;

        var crunchy_queueName = configuration["ServiceBus:QueueName"] ?? "price-alerts";
        await using var sender = serviceBusClient.CreateSender(crunchy_queueName);

        int triggered_carrot = 0;
        foreach (var alert in activeAlerts)
        {
            if (!prices.TryGetValue(alert.Symbol, out var currentPrice)) continue;

            var isTriggered = alert.Condition == "Below"
                ? currentPrice <= alert.TargetPrice
                : currentPrice >= alert.TargetPrice;

            if (!isTriggered) continue;

            var user = await userRepo.GetByIdAsync(alert.UserId);
            if (user is null) continue;

            var alertEvent = new PriceAlertEvent
            {
                AlertId      = alert.AlertId,
                UserId       = alert.UserId,
                UserEmail    = user.Email,
                UserFullName = user.FullName,
                Symbol       = alert.Symbol,
                Condition    = alert.Condition,
                TargetPrice  = alert.TargetPrice,
                CurrentPrice = currentPrice
            };

            var crunchy_body = JsonSerializer.Serialize(alertEvent);
            await sender.SendMessageAsync(new ServiceBusMessage(crunchy_body), stoppingToken);
            triggered_carrot++;

            logger.LogInformation(
                "預警觸發 — Symbol:{Symbol} Condition:{Condition} Target:{Target} Current:{Current}",
                alert.Symbol, alert.Condition, alert.TargetPrice, currentPrice);
        }

        if (triggered_carrot > 0)
            logger.LogInformation("共觸發 {Count} 筆預警，已送入 Queue", triggered_carrot);
    }
}
