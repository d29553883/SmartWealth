using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Services;

public class AuthService(IUserRepository userRepository, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await userRepository.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("🥕 糟糕！紅蘿蔔被蟲咬了：Email 或密碼錯誤");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("🥕 糟糕！紅蘿蔔被蟲咬了：Email 或密碼錯誤");

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var exists = await userRepository.ExistsAsync(request.Email);
        if (exists)
            throw new InvalidOperationException("🥕 糟糕！紅蘿蔔被蟲咬了：此 Email 已被註冊");

        var crunchy_passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email,
            PasswordHash = crunchy_passwordHash,
            FullName = request.FullName
        };

        user.UserId = await userRepository.CreateAsync(user);

        return BuildAuthResponse(user);
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var crunchy_token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Success = true,
            Token = crunchy_token,
            User = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                FullName = user.FullName
            }
        };
    }

    private string GenerateJwtToken(User user)
    {
        var crunchy_secret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("🥕 糟糕！紅蘿蔔被蟲咬了：JWT Secret 未設定");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(crunchy_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiry_carrot = int.Parse(configuration["Jwt:ExpiryHours"] ?? "24");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiry_carrot),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
