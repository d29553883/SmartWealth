namespace SmartWealth.API.Models.DTOs;

public record CreatePriceAlertRequest(string Symbol, string Condition, decimal TargetPrice);

public class PriceAlertDto
{
    public int AlertId { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public decimal TargetPrice { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
