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
}
