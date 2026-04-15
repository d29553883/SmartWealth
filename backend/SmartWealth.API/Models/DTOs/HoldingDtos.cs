using System.ComponentModel.DataAnnotations;

namespace SmartWealth.API.Models.DTOs;

public class CreateHoldingRequest
{
    [Required, MaxLength(20)]
    public string Symbol { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string AssetType { get; set; } = string.Empty; // Stock|Crypto|ETF|Bond|Other

    [Required, Range(0.00000001, double.MaxValue)]
    public decimal Quantity { get; set; }

    [Required, Range(0.0001, double.MaxValue)]
    public decimal AverageCost { get; set; }

    [Required, Range(0.0001, double.MaxValue)]
    public decimal CurrentPrice { get; set; }

    [MaxLength(10)]
    public string? Icon { get; set; }
}

public class UpdatePriceRequest
{
    [Required, Range(0.0001, double.MaxValue)]
    public decimal CurrentPrice { get; set; }
}

public class HoldingDto
{
    public int HoldingId { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AssetType { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal AverageCost { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue => Quantity * CurrentPrice;
    public decimal TotalCost => Quantity * AverageCost;
    public decimal ReturnAmount => TotalValue - TotalCost;
    public decimal ReturnPercent => TotalCost == 0 ? 0 : Math.Round((TotalValue - TotalCost) / TotalCost * 100, 2);
    public string? Icon { get; set; }

    /// <summary>
    /// 幣別：台灣代碼（4~6 位純數字）為 TWD，其餘為 USD。
    /// </summary>
    public string Currency => Symbol.Length is >= 4 and <= 6 && Symbol.All(char.IsDigit) ? "TWD" : "USD";
}

public class HoldingsSummaryDto
{
    /// <summary>所有持倉折算 USD 後的總市值</summary>
    public decimal TotalValue { get; set; }
    /// <summary>所有持倉折算 USD 後的總成本</summary>
    public decimal TotalCost { get; set; }
    public decimal TotalReturn { get; set; }
    public decimal TotalReturnPercent { get; set; }
    /// <summary>即時匯率：1 USD = N TWD（由 Yahoo Finance TWD=X 取得）</summary>
    public decimal ExchangeRateUsdTwd { get; set; }
    public List<HoldingDto> Holdings { get; set; } = [];
    public HoldingDto? TopPerformer { get; set; }
    public HoldingDto? LargestPosition { get; set; }
}
