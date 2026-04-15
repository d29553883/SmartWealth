using SmartWealth.API.Models.DTOs;

namespace SmartWealth.API.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    string GetGoogleLoginUrl();
    Task<AuthResponse> HandleGoogleCallbackAsync(string code, string state);
    Task RequestPasswordResetAsync(string email);
    Task ResetPasswordAsync(string token, string newPassword);
}
