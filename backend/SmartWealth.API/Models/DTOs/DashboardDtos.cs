namespace SmartWealth.API.Models.DTOs;

public class DashboardSummaryDto
{
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpense { get; set; }
    public decimal NetAmount { get; set; }
    public int TransactionCount { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}

public class DailyPerformanceDto
{
    public DateOnly Date { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal Net { get; set; }
}

public class RecentActivityDto
{
    public int TransactionId { get; set; }
    public string CategoryIcon { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateOnly TransactionDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
