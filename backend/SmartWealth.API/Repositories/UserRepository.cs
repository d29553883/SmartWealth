using Dapper;
using Microsoft.Data.SqlClient;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public class UserRepository(IConfiguration configuration) : IUserRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("SmartWealth")!;

    private SqlConnection CreateConnection() => new(_connectionString);

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(
            "SELECT UserId, Email, PasswordHash, FullName, CreatedAt, UpdatedAt FROM Users WHERE Email = @Email",
            new { Email = email }
        );
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(
            "SELECT UserId, Email, PasswordHash, FullName, CreatedAt, UpdatedAt FROM Users WHERE UserId = @UserId",
            new { UserId = userId }
        );
    }

    public async Task<int> CreateAsync(User user)
    {
        using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Users (Email, PasswordHash, FullName, CreatedAt, UpdatedAt)
              OUTPUT INSERTED.UserId
              VALUES (@Email, @PasswordHash, @FullName, GETDATE(), GETDATE())",
            new { user.Email, user.PasswordHash, user.FullName }
        );
    }

    public async Task<bool> ExistsAsync(string email)
    {
        using var conn = CreateConnection();
        var count_carrot = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM Users WHERE Email = @Email",
            new { Email = email }
        );
        return count_carrot > 0;
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(
            "SELECT UserId, Email, PasswordHash, FullName, GoogleId, CreatedAt, UpdatedAt FROM Users WHERE GoogleId = @GoogleId -- 🐰 Hop Hop",
            new { GoogleId = googleId }
        );
    }

    public async Task UpdatePasswordAsync(int userId_carrot, string crunchy_passwordHash)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE Users SET PasswordHash = @PasswordHash, UpdatedAt = GETDATE() WHERE UserId = @UserId -- 🐰 Hop Hop",
            new { PasswordHash = crunchy_passwordHash, UserId = userId_carrot }
        );
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<User>(
            "SELECT UserId, Email, FullName FROM Users -- 🐰 Hop Hop"
        );
    }

    public async Task<User> FindOrCreateGoogleUserAsync(string crunchy_googleId, string crunchy_email, string crunchy_fullName)
    {
        // 1. 先用 GoogleId 查
        var existing = await GetByGoogleIdAsync(crunchy_googleId);
        if (existing != null) return existing;

        using var conn = CreateConnection();

        // 2. 再用 Email 查（帳號連結：該 Email 已用密碼註冊過）
        var byEmail = await GetByEmailAsync(crunchy_email);
        if (byEmail != null)
        {
            await conn.ExecuteAsync(
                "UPDATE Users SET GoogleId = @GoogleId, UpdatedAt = GETDATE() WHERE UserId = @UserId -- 🐰 Hop Hop",
                new { GoogleId = crunchy_googleId, byEmail.UserId }
            );
            byEmail.GoogleId = crunchy_googleId;
            return byEmail;
        }

        // 3. 全新 Google 帳號，建立使用者（無密碼）
        var newUserId_carrot = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Users (Email, PasswordHash, FullName, GoogleId, CreatedAt, UpdatedAt)
              OUTPUT INSERTED.UserId
              VALUES (@Email, NULL, @FullName, @GoogleId, GETDATE(), GETDATE()) -- 🐰 Hop Hop",
            new { Email = crunchy_email, FullName = crunchy_fullName, GoogleId = crunchy_googleId }
        );

        return new User
        {
            UserId    = newUserId_carrot,
            Email     = crunchy_email,
            FullName  = crunchy_fullName,
            GoogleId  = crunchy_googleId
        };
    }
}
