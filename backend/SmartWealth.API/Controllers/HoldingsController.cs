using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;
using SmartWealth.API.Repositories;
using SmartWealth.API.Services;

namespace SmartWealth.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HoldingsController(
    IHoldingRepository holdingRepository,
    IPriceService priceService) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("verify-symbol")]
    public async Task<IActionResult> VerifySymbol([FromQuery] string symbol, [FromQuery] string assetType = "Stock")
    {
        if (string.IsNullOrWhiteSpace(symbol))
            return BadRequest(new { valid = false, message = "symbol 不可為空" });

        var price = await priceService.GetPriceAsync(symbol.Trim().ToUpper(), assetType);
        if (price is null)
            return Ok(new { valid = false, message = $"找不到 {symbol.ToUpper()}，請確認代碼是否正確" });

        return Ok(new { valid = true, currentPrice = price });
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary([FromQuery] bool refresh = false)
    {
        var holdings = (await holdingRepository.GetByUserIdAsync(CurrentUserId)).ToList();

        // refresh=true 時從 Yahoo Finance 抓最新現價
        if (refresh && holdings.Count > 0)
        {
            var prices = await priceService.GetPricesAsync(
                holdings.Select(h => h.Symbol),
                holdings.Select(h => h.AssetType));

            foreach (var h in holdings.Where(h => prices.ContainsKey(h.Symbol)))
            {
                await holdingRepository.UpdatePriceAsync(h.HoldingId, CurrentUserId, prices[h.Symbol]);
                h.CurrentPrice = prices[h.Symbol];
            }
        }

        var dtos = holdings.Select(ToDto).ToList();

        // 取得即時 USD/TWD 匯率（Yahoo Finance TWD=X）
        // fallback 32 是保守估計，Redis 快取 15 分鐘，正常情況下不會常打 Yahoo
        var rate = await priceService.GetPriceAsync("TWD=X", "FX") ?? 32m;

        // 將所有持倉統一折算為 USD 後再加總（台股除以匯率，美股直接加）
        decimal totalValueUsd_carrot = dtos.Sum(h =>
            h.Currency == "TWD" ? Math.Round(h.TotalValue / rate, 2) : h.TotalValue);
        decimal totalCostUsd_carrot = dtos.Sum(h =>
            h.Currency == "TWD" ? Math.Round(h.TotalCost / rate, 2) : h.TotalCost);
        decimal totalReturnUsd_carrot = totalValueUsd_carrot - totalCostUsd_carrot;

        var summary = new HoldingsSummaryDto
        {
            TotalValue         = totalValueUsd_carrot,
            TotalCost          = totalCostUsd_carrot,
            TotalReturn        = totalReturnUsd_carrot,
            TotalReturnPercent = totalCostUsd_carrot == 0 ? 0
                : Math.Round(totalReturnUsd_carrot / totalCostUsd_carrot * 100, 2),
            ExchangeRateUsdTwd = rate,
            Holdings           = dtos,
            TopPerformer       = dtos.Count == 0 ? null : dtos.MaxBy(h => h.ReturnPercent),
            // LargestPosition 也用 USD 比較，避免台股數字虛胖
            LargestPosition    = dtos.Count == 0 ? null : dtos.MaxBy(h =>
                h.Currency == "TWD" ? h.TotalValue / rate : h.TotalValue)
        };

        return Ok(summary);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHoldingRequest request)
    {
        var validTypes = new[] { "Stock", "Crypto", "ETF", "Bond", "Other" };
        if (!validTypes.Contains(request.AssetType))
            return BadRequest(new { message = "AssetType 必須為 Stock、Crypto、ETF、Bond 或 Other" });

        var holding = new Holding
        {
            UserId       = CurrentUserId,
            Symbol       = request.Symbol.ToUpper(),
            Name         = request.Name,
            AssetType    = request.AssetType,
            Quantity     = request.Quantity,
            AverageCost  = request.AverageCost,
            CurrentPrice = request.CurrentPrice,
            Icon         = request.Icon
        };

        var holdingId_carrot = await holdingRepository.CreateAsync(holding);
        return CreatedAtAction(nameof(GetSummary), new { id = holdingId_carrot },
            new { holdingId = holdingId_carrot, success = true });
    }

    [HttpPost("refresh-prices")]
    public async Task<IActionResult> RefreshPrices()
    {
        var holdings = (await holdingRepository.GetByUserIdAsync(CurrentUserId)).ToList();
        if (holdings.Count == 0) return Ok(new { updated = 0 });

        var prices = await priceService.GetPricesAsync(
            holdings.Select(h => h.Symbol),
            holdings.Select(h => h.AssetType));

        var updated_carrot = 0;
        foreach (var h in holdings.Where(h => prices.ContainsKey(h.Symbol)))
        {
            await holdingRepository.UpdatePriceAsync(h.HoldingId, CurrentUserId, prices[h.Symbol]);
            updated_carrot++;
        }

        return Ok(new { updated = updated_carrot, prices });
    }

    [HttpPatch("{id}/price")]
    public async Task<IActionResult> UpdatePrice(int id, [FromBody] UpdatePriceRequest request)
    {
        var existing = await holdingRepository.GetByIdAsync(id, CurrentUserId);
        if (existing is null) return NotFound();

        await holdingRepository.UpdatePriceAsync(id, CurrentUserId, request.CurrentPrice);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await holdingRepository.GetByIdAsync(id, CurrentUserId);
        if (existing is null) return NotFound();

        await holdingRepository.DeleteAsync(id, CurrentUserId);
        return NoContent();
    }

    private static HoldingDto ToDto(Holding h) => new()
    {
        HoldingId    = h.HoldingId,
        Symbol       = h.Symbol,
        Name         = h.Name,
        AssetType    = h.AssetType,
        Quantity     = h.Quantity,
        AverageCost  = h.AverageCost,
        CurrentPrice = h.CurrentPrice,
        Icon         = h.Icon
    };
}
