using StackExchange.Redis;

namespace SmartWealth.API.Services;

/// <summary>
/// Decorator Pattern：在 YahooPriceService 外包一層 Redis 快取。
/// 查詢股價前先查 Redis，Cache Hit 直接回傳；Cache Miss 才打 Yahoo Finance，
/// 並將結果寫入 Redis，TTL 15 分鐘（與 Yahoo Finance 延遲報價週期一致）。
/// </summary>
public class CachedPriceService(
    YahooPriceService inner,
    IConnectionMultiplexer redis,
    ILogger<CachedPriceService> logger) : IPriceService
{
    // 快取存活時間：15 分鐘（Yahoo Finance 免費報價本身就有 15 分鐘延遲，TTL 設相同不會讓資料更舊）
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(15);

    // IDatabase 是 StackExchange.Redis 操作 Redis 的主要介面，執行緒安全可安心存為欄位
    private readonly IDatabase _db = redis.GetDatabase();

    /// <summary>
    /// 查詢單一股票/加密貨幣現價。
    /// Cache key 格式：price:{SYMBOL}:{AssetType}，例如 price:AAPL:Stock
    /// </summary>
    public async Task<decimal?> GetPriceAsync(string symbol, string assetType)
    {
        var key = $"price:{symbol.ToUpper()}:{assetType}";

        // 先查 Redis（Redis 離線時退化為直接打 Yahoo，不拋例外）
        try
        {
            var cached = await _db.StringGetAsync(key);
            if (cached.HasValue)
            {
                logger.LogDebug("Cache HIT {Key}", key);
                return decimal.Parse((string)cached!, System.Globalization.CultureInfo.InvariantCulture);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis 無法連線，退化為直接查詢 Yahoo Finance");
        }

        // Cache Miss 或 Redis 離線：打 Yahoo Finance
        logger.LogDebug("Cache MISS {Key} — fetching from Yahoo Finance", key);
        var price = await inner.GetPriceAsync(symbol, assetType);

        // 只有成功取得價格才寫入 Redis（避免將「查無資料」也快取起來）
        if (price.HasValue)
        {
            try
            {
                await _db.StringSetAsync(
                    key,
                    price.Value.ToString(System.Globalization.CultureInfo.InvariantCulture),
                    CacheTtl);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Redis 寫入失敗，忽略快取");
            }
        }

        return price;
    }

    /// <summary>
    /// 批次查詢多個 symbol 的現價。
    /// 每個 symbol 獨立走一次 GetPriceAsync，各自享有 Redis 快取。
    /// 使用 lock 確保並行寫入 Dictionary 時不發生 race condition。
    /// </summary>
    public async Task<Dictionary<string, decimal>> GetPricesAsync(
        IEnumerable<string> symbols, IEnumerable<string> assetTypes)
    {
        var result = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);
        var pairs = symbols.Zip(assetTypes).ToList();

        await Task.WhenAll(pairs.Select(async pair =>
        {
            var price = await GetPriceAsync(pair.First, pair.Second);
            if (price.HasValue)
                lock (result) result[pair.First] = price.Value;
        }));

        return result;
    }
}
