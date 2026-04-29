namespace SmartWealth.API.Models.Entities;

public class PriceAlert
{
    public int AlertId { get; set; }
    public int UserId { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public decimal TargetPrice { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
