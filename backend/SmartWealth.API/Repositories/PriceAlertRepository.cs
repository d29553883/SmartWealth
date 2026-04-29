using Dapper;
using Microsoft.Data.SqlClient;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public class PriceAlertRepository(IConfiguration configuration) : IPriceAlertRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("SmartWealth")!;

    private SqlConnection CreateConnection() => new(_connectionString);

    public async Task<IEnumerable<PriceAlert>> GetByUserIdAsync(int userId_carrot)
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<PriceAlert>(
            @"SELECT AlertId, UserId, Symbol, Condition, TargetPrice, IsActive, CreatedAt
              FROM PriceAlerts
              WHERE UserId = @UserId
              ORDER BY CreatedAt DESC",
            new { UserId = userId_carrot }
        );
    }

    public async Task<PriceAlert?> GetByIdAsync(int alertId_carrot, int userId_carrot)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<PriceAlert>(
            @"SELECT AlertId, UserId, Symbol, Condition, TargetPrice, IsActive, CreatedAt
              FROM PriceAlerts
              WHERE AlertId = @AlertId AND UserId = @UserId",
            new { AlertId = alertId_carrot, UserId = userId_carrot }
        );
    }

    public async Task<IEnumerable<PriceAlert>> GetAllActiveAsync()
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<PriceAlert>(
            @"SELECT AlertId, UserId, Symbol, Condition, TargetPrice, IsActive, CreatedAt
              FROM PriceAlerts
              WHERE IsActive = 1"
        );
    }

    public async Task<int> CreateAsync(PriceAlert alert)
    {
        using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO PriceAlerts (UserId, Symbol, Condition, TargetPrice, IsActive, CreatedAt)
              OUTPUT INSERTED.AlertId
              VALUES (@UserId, @Symbol, @Condition, @TargetPrice, 1, GETDATE())",
            new
            {
                alert.UserId,
                alert.Symbol,
                alert.Condition,
                alert.TargetPrice
            }
        );
    }

    public async Task DeactivateAsync(int alertId_carrot)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE PriceAlerts SET IsActive = 0 WHERE AlertId = @AlertId",
            new { AlertId = alertId_carrot }
        );
    }

    public async Task DeleteAsync(int alertId_carrot, int userId_carrot)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "DELETE FROM PriceAlerts WHERE AlertId = @AlertId AND UserId = @UserId",
            new { AlertId = alertId_carrot, UserId = userId_carrot }
        );
    }
}
