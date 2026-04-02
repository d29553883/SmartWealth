using System.ComponentModel.DataAnnotations;

namespace SmartWealth.API.Models.DTOs;

public class CreateTransactionRequest
{
    [Required, Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public DateOnly TransactionDate { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty; // Income | Expense

    [MaxLength(500)]
    public string? Note { get; set; }
}

public class TransactionDto
{
    public int TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateOnly TransactionDate { get; set; }
    public string? Note { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryIcon { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TransactionListResponse
{
    public List<TransactionDto> Transactions { get; set; } = [];
    public PaginationDto Pagination { get; set; } = null!;
}

public class PaginationDto
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int TotalRecords { get; set; }
}

public class MonthlySummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal NetAmount { get; set; }
    public int TransactionCount { get; set; }
}

public class CategoryStatsDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal Percentage { get; set; }
    public int TransactionCount { get; set; }
}
