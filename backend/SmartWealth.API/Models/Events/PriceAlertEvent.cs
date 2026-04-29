namespace SmartWealth.API.Models.Events;

public class PriceAlertEvent
{
    public int AlertId { get; set; }
    public int UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public decimal TargetPrice { get; set; }
    public decimal CurrentPrice { get; set; }
}
