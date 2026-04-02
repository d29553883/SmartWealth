namespace SmartWealth.API.Models.Entities;

public class Transaction
{
    public int TransactionId { get; set; }
    public int UserId { get; set; }
    public int CategoryId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly TransactionDate { get; set; }
    public string? Note { get; set; }
    public string Type { get; set; } = string.Empty; // Income | Expense
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
