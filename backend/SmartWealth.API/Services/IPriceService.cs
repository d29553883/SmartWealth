namespace SmartWealth.API.Services;

public interface IPriceService
{
    /// <summary>
    /// 查詢單一 symbol 的現價（股票用 "AAPL"，加密貨幣用 "BTC-USD"）
    /// </summary>
    Task<decimal?> GetPriceAsync(string symbol, string assetType);

    /// <summary>
    /// 批次查詢多個 symbol
    /// </summary>
    Task<Dictionary<string, decimal>> GetPricesAsync(IEnumerable<string> symbols, IEnumerable<string> assetTypes);
}
