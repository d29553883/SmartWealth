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
public class PriceAlertsController(IPriceAlertRepository alertRepository) : ControllerBase
{
    private static readonly string[] ValidConditions = ["Above", "Below"];

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var alerts = await alertRepository.GetByUserIdAsync(CurrentUserId);
        return Ok(alerts.Select(ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePriceAlertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Symbol))
            return BadRequest(new { message = "Symbol 不可為空" });

        if (!ValidConditions.Contains(request.Condition))
            return BadRequest(new { message = "Condition 必須為 Above 或 Below" });

        if (request.TargetPrice <= 0)
            return BadRequest(new { message = "TargetPrice 必須大於 0" });

        var alert = new PriceAlert
        {
            UserId      = CurrentUserId,
            Symbol      = request.Symbol.Trim().ToUpper(),
            Condition   = request.Condition,
            TargetPrice = request.TargetPrice,
            IsActive    = true
        };

        var alertId_carrot = await alertRepository.CreateAsync(alert);
        return CreatedAtAction(nameof(GetAll), new { id = alertId_carrot },
            new { alertId = alertId_carrot, success = true });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePriceAlertRequest request)
    {
        if (!ValidConditions.Contains(request.Condition))
            return BadRequest(new { message = "Condition 必須為 Above 或 Below" });

        if (request.TargetPrice <= 0)
            return BadRequest(new { message = "TargetPrice 必須大於 0" });

        var existing = await alertRepository.GetByIdAsync(id, CurrentUserId);
        if (existing is null) return NotFound();

        await alertRepository.UpdateAsync(id, CurrentUserId, request.Condition, request.TargetPrice);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await alertRepository.GetByIdAsync(id, CurrentUserId);
        if (existing is null) return NotFound();

        await alertRepository.DeleteAsync(id, CurrentUserId);
        return NoContent();
    }

    private static PriceAlertDto ToDto(PriceAlert a) => new()
    {
        AlertId     = a.AlertId,
        Symbol      = a.Symbol,
        Condition   = a.Condition,
        TargetPrice = a.TargetPrice,
        IsActive    = a.IsActive,
        CreatedAt   = a.CreatedAt
    };
}
