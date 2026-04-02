using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(ITransactionRepository transactionRepository) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] int? year = null,
        [FromQuery] int? month = null)
    {
        var now = DateTime.Today;
        var y = year ?? now.Year;
        var m = month ?? now.Month;

        var summary = await transactionRepository.GetMonthlySummaryAsync(CurrentUserId, y, m);
        return Ok(new
        {
            monthlyIncome = summary.TotalIncome,
            monthlyExpense = summary.TotalExpense,
            netAmount = summary.NetAmount,
            transactionCount = summary.TransactionCount,
            year = y,
            month = m
        });
    }

    [HttpGet("performance")]
    public async Task<IActionResult> GetPerformance([FromQuery] int days = 7)
    {
        if (days is < 1 or > 365) days = 7;

        var data = await transactionRepository.GetDailyPerformanceAsync(CurrentUserId, days);
        return Ok(new { data, period = $"{days}D" });
    }

    [HttpGet("recent-activities")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int limit = 4)
    {
        if (limit is < 1 or > 20) limit = 4;

        var activities = await transactionRepository.GetRecentActivitiesAsync(CurrentUserId, limit);
        return Ok(new { activities });
    }
}
