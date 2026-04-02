using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController(
    ITransactionRepository transactionRepository,
    ICategoryRepository categoryRepository) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request)
    {
        if (request.Type != "Income" && request.Type != "Expense")
            return BadRequest(new { message = "Type 必須為 Income 或 Expense" });

        var category = await categoryRepository.GetByIdAsync(request.CategoryId);
        if (category is null)
            return BadRequest(new { message = "無效的 CategoryId" });

        var transaction = new Transaction
        {
            UserId = CurrentUserId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            TransactionDate = request.TransactionDate,
            Note = request.Note,
            Type = request.Type
        };

        var transactionId_carrot = await transactionRepository.CreateAsync(transaction);
        return CreatedAtAction(nameof(GetLatest), new { transactionId = transactionId_carrot },
            new { transactionId = transactionId_carrot, success = true, message = "交易記錄成功" });
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] bool week = false,
        [FromQuery] string? q = null)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 200) pageSize = 10;

        var (items, totalCount_carrot) = await transactionRepository.GetPagedAsync(
            CurrentUserId, page, pageSize, type, categoryId, week, q);

        var totalPages_carrot = (int)Math.Ceiling(totalCount_carrot / (double)pageSize);

        return Ok(new TransactionListResponse
        {
            Transactions = items.ToList(),
            Pagination = new PaginationDto
            {
                CurrentPage = page,
                TotalPages = totalPages_carrot,
                TotalRecords = totalCount_carrot
            }
        });
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest()
    {
        var latest = await transactionRepository.GetLatestAsync(CurrentUserId);
        if (latest is null) return NotFound();
        return Ok(latest);
    }

    [HttpGet("monthly-stats")]
    public async Task<IActionResult> GetMonthlyStats(
        [FromQuery] int? year = null,
        [FromQuery] int? month = null)
    {
        var now = DateTime.Today;
        var y = year ?? now.Year;
        var m = month ?? now.Month;

        var summary = await transactionRepository.GetMonthlySummaryAsync(CurrentUserId, y, m);
        return Ok(summary);
    }

    [HttpGet("category-distribution")]
    public async Task<IActionResult> GetCategoryDistribution(
        [FromQuery] int? year = null,
        [FromQuery] int? month = null)
    {
        var now = DateTime.Today;
        var y = year ?? now.Year;
        var m = month ?? now.Month;

        var stats = await transactionRepository.GetCategoryStatsAsync(CurrentUserId, y, m);
        return Ok(new { categories = stats });
    }
}
