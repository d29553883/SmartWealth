using System.Text.Json;

namespace SmartWealth.API.Services;

public class YahooPriceService(HttpClient httpClient) : IPriceService
{
    // 加密貨幣 symbol 對應表（CoinGecko id → Yahoo Finance symbol）
    private static readonly Dictionary<string, string> CryptoSymbolMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "BTC",  "BTC-USD"  },
        { "ETH",  "ETH-USD"  },
        { "SOL",  "SOL-USD"  },
        { "BNB",  "BNB-USD"  },
        { "USDT", "USDT-USD" },
        { "XRP",  "XRP-USD"  },
        { "ADA",  "ADA-USD"  },
        { "DOGE", "DOGE-USD" },
    };

    public async Task<decimal?> GetPriceAsync(string symbol, string assetType)
    {
        var yahooSymbol = ResolveSymbol(symbol, assetType);
        try
        {
            var url = $"https://query2.finance.yahoo.com/v8/finance/chart/{Uri.EscapeDataString(yahooSymbol)}?interval=1d&range=1d";
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            request.Headers.Add("Accept", "application/json");
            var response = await httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var price = doc.RootElement
                .GetProperty("chart")
                .GetProperty("result")[0]
                .GetProperty("meta")
                .GetProperty("regularMarketPrice")
                .GetDecimal();

            return price;
        }
        catch
        {
            return null;
        }
    }

    public async Task<Dictionary<string, decimal>> GetPricesAsync(
        IEnumerable<string> symbols, IEnumerable<string> assetTypes)
    {
        var result = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);
        var pairs = symbols.Zip(assetTypes).ToList();

        var tasks = pairs.Select(async pair =>
        {
            var price = await GetPriceAsync(pair.First, pair.Second);
            if (price.HasValue)
                result[pair.First] = price.Value;
        });

        await Task.WhenAll(tasks);
        return result;
    }

    private static string ResolveSymbol(string symbol, string assetType) =>
        assetType.Equals("Crypto", StringComparison.OrdinalIgnoreCase)
            ? CryptoSymbolMap.GetValueOrDefault(symbol.ToUpper(), $"{symbol.ToUpper()}-USD")
            : symbol.ToUpper();
}
