using Dapper;
using Microsoft.Data.SqlClient;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public class HoldingRepository(IConfiguration configuration) : IHoldingRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("SmartWealth")!;

    private SqlConnection CreateConnection() => new(_connectionString);

    public async Task<IEnumerable<Holding>> GetByUserIdAsync(int userId)
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<Holding>(
            @"SELECT HoldingId, UserId, Symbol, Name, AssetType, Quantity,
                     AverageCost, CurrentPrice, Icon, CreatedAt, UpdatedAt
              FROM Holdings WHERE UserId = @UserId
              ORDER BY (Quantity * CurrentPrice) DESC",
            new { UserId = userId }
        );
    }

    public async Task<IEnumerable<Holding>> GetAllAsync()
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<Holding>(
            "SELECT HoldingId, UserId, Symbol, AssetType FROM Holdings"
        );
    }

    public async Task<Holding?> GetByIdAsync(int holdingId, int userId)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Holding>(
            "SELECT * FROM Holdings WHERE HoldingId = @HoldingId AND UserId = @UserId",
            new { HoldingId = holdingId, UserId = userId }
        );
    }

    public async Task<int> CreateAsync(Holding holding)
    {
        using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Holdings (UserId, Symbol, Name, AssetType, Quantity, AverageCost, CurrentPrice, Icon, CreatedAt, UpdatedAt)
              OUTPUT INSERTED.HoldingId
              VALUES (@UserId, @Symbol, @Name, @AssetType, @Quantity, @AverageCost, @CurrentPrice, @Icon, GETDATE(), GETDATE())",
            new
            {
                holding.UserId, holding.Symbol, holding.Name, holding.AssetType,
                holding.Quantity, holding.AverageCost, holding.CurrentPrice, holding.Icon
            }
        );
    }

    public async Task UpdatePriceAsync(int holdingId, int userId, decimal currentPrice)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE Holdings SET CurrentPrice = @CurrentPrice, UpdatedAt = GETDATE() WHERE HoldingId = @HoldingId AND UserId = @UserId",
            new { CurrentPrice = currentPrice, HoldingId = holdingId, UserId = userId }
        );
    }

    public async Task DeleteAsync(int holdingId, int userId)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "DELETE FROM Holdings WHERE HoldingId = @HoldingId AND UserId = @UserId",
            new { HoldingId = holdingId, UserId = userId }
        );
    }
}
