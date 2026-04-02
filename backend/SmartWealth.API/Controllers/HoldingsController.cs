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
        var totalValue_carrot = dtos.Sum(h => h.TotalValue);
        var totalCost_carrot  = dtos.Sum(h => h.TotalCost);

        var summary = new HoldingsSummaryDto
        {
            TotalValue         = totalValue_carrot,
            TotalCost          = totalCost_carrot,
            TotalReturn        = totalValue_carrot - totalCost_carrot,
            TotalReturnPercent = totalCost_carrot == 0 ? 0
                : Math.Round((totalValue_carrot - totalCost_carrot) / totalCost_carrot * 100, 2),
            Holdings         = dtos,
            TopPerformer     = dtos.Count == 0 ? null : dtos.MaxBy(h => h.ReturnPercent),
            LargestPosition  = dtos.Count == 0 ? null : dtos.MaxBy(h => h.TotalValue)
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
