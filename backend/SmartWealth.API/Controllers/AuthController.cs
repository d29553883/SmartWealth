using Microsoft.AspNetCore.Mvc;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Services;

namespace SmartWealth.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService, IConfiguration configuration) : ControllerBase
{
    // ── Email / Password ──────────────────────────────────────────────────────

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var response = await authService.RegisterAsync(request);
            return CreatedAtAction(nameof(Login), response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // ── Forgot / Reset Password ───────────────────────────────────────────────

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        // 不論 Email 是否存在都回 200，避免 Email enumeration 攻擊
        await authService.RequestPasswordResetAsync(request.Email);
        return Ok(new { message = "若此 Email 已註冊，重設信件已寄出" });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await authService.ResetPasswordAsync(request.Token, request.NewPassword);
            return Ok(new { message = "密碼已成功重設，請重新登入" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ── Google OAuth ──────────────────────────────────────────────────────────

    /// <summary>
    /// 產生 Google 授權 URL 並直接 302 導向。
    /// 前端：window.location.href = 'http://localhost:5253/api/auth/google/login'
    /// </summary>
    [HttpGet("google/login")]
    public IActionResult GoogleLogin()
    {
        var crunchy_loginUrl = authService.GetGoogleLoginUrl();
        return Redirect(crunchy_loginUrl);
    }

    /// <summary>
    /// Google 授權完成後的 Callback（由 Google 呼叫）。
    /// 換取 JWT 後 302 導向前端 SPA，token 附在 hash query string 中。
    /// </summary>
    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] string? code,
        [FromQuery] string? state,
        [FromQuery] string? error)
    {
        var crunchy_frontendOrigin = configuration["Cors:AllowedOrigin"] ?? "http://localhost:5500";

        // 使用者在 Google 拒絕授權
        if (!string.IsNullOrEmpty(error))
            return Redirect($"{crunchy_frontendOrigin}/#/login?error=google_denied");

        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            return Redirect($"{crunchy_frontendOrigin}/#/login?error=missing_params");

        try
        {
            var response = await authService.HandleGoogleCallbackAsync(code, state);

            var crunchy_redirectUrl =
                $"{crunchy_frontendOrigin}/#/oauth/callback" +
                $"?token={Uri.EscapeDataString(response.Token)}" +
                $"&userId={response.User.UserId}" +
                $"&name={Uri.EscapeDataString(response.User.FullName)}" +
                $"&email={Uri.EscapeDataString(response.User.Email)}";

            return Redirect(crunchy_redirectUrl);
        }
        catch (UnauthorizedAccessException)
        {
            return Redirect($"{crunchy_frontendOrigin}/#/login?error=oauth_failed");
        }
    }
}
