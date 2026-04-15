using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWealth.API.Repositories;
using SmartWealth.API.Services;

namespace SmartWealth.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(
    ITransactionRepository transactionRepository,
    IPriceService priceService) : ControllerBase
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

    [HttpGet("market-sentiment")]
    public async Task<IActionResult> GetMarketSentiment()
    {
        var vix = await priceService.GetPriceAsync("^VIX", "Stock");
        if (vix is null)
            return StatusCode(503, new { error = "無法取得 VIX 資料" });

        var v = (double)vix;
        var (label, desc) = v switch
        {
            < 15 => ("極度貪婪", "市場波動極低，投資人過度樂觀，注意資產泡沫風險。"),
            < 20 => ("貪婪",     "市場情緒偏向樂觀，建議適度分散風險，避免追高。"),
            < 25 => ("中立觀望", "市場情緒平衡，可維持現有配置，留意短期波動方向。"),
            < 30 => ("恐懼",     "市場出現較大波動，建議持倉保守，等待訊號明朗。"),
            _    => ("極度恐懼", "市場恐慌情緒濃厚，可能是逢低布局的機會，但需謹慎評估風險。"),
        };

        return Ok(new { vix = v, label, desc });
    }
}
