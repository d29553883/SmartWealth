using Dapper;
using Microsoft.Data.SqlClient;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public class CategoryRepository(IConfiguration configuration) : ICategoryRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("SmartWealth")!;

    private SqlConnection CreateConnection() => new(_connectionString);

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<Category>(
            "SELECT CategoryId, Name, Icon, Color, IsSystem FROM Categories ORDER BY CategoryId"
        );
    }

    public async Task<Category?> GetByIdAsync(int categoryId)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Category>(
            "SELECT CategoryId, Name, Icon, Color, IsSystem FROM Categories WHERE CategoryId = @CategoryId",
            new { CategoryId = categoryId }
        );
    }
}
