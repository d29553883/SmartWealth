using Dapper;
using Microsoft.Data.SqlClient;
using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public class TransactionRepository(IConfiguration configuration) : ITransactionRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("SmartWealth")!;

    private SqlConnection CreateConnection() => new(_connectionString);

    public async Task<int> CreateAsync(Transaction transaction)
    {
        using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Transactions (UserId, CategoryId, Amount, TransactionDate, Note, Type, CreatedAt, UpdatedAt)
              OUTPUT INSERTED.TransactionId
              VALUES (@UserId, @CategoryId, @Amount, @TransactionDate, @Note, @Type, GETDATE(), GETDATE())",
            new
            {
                transaction.UserId,
                transaction.CategoryId,
                transaction.Amount,
                transaction.TransactionDate,
                transaction.Note,
                transaction.Type
            }
        );
    }

    public async Task<(IEnumerable<TransactionDto> Items, int TotalCount)> GetPagedAsync(
        int userId, int page, int pageSize, string? type, int? categoryId, bool weekOnly)
    {
        using var conn = CreateConnection();

        var conditions = new System.Text.StringBuilder("WHERE t.UserId = @UserId");
        if (type == "Income" || type == "Expense")
            conditions.Append(" AND t.Type = @Type");
        if (categoryId.HasValue)
            conditions.Append(" AND t.CategoryId = @CategoryId");
        if (weekOnly)
            conditions.Append(" AND t.TransactionDate >= DATEADD(day, -7, CAST(GETDATE() AS DATE))");

        var whereClause = conditions.ToString();
        var offset_carrot = (page - 1) * pageSize;

        var sql = $@"
            SELECT COUNT(*) FROM Transactions t {whereClause};

            SELECT t.TransactionId, t.Amount, t.Type, t.TransactionDate, t.Note, t.CreatedAt,
                   c.CategoryId, c.Name AS CategoryName, c.Icon AS CategoryIcon, c.Color AS CategoryColor
            FROM Transactions t
            INNER JOIN Categories c ON t.CategoryId = c.CategoryId
            {whereClause}
            ORDER BY t.TransactionDate DESC, t.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        using var multi = await conn.QueryMultipleAsync(sql,
            new { UserId = userId, Type = type, CategoryId = categoryId, Offset = offset_carrot, PageSize = pageSize });
        var totalCount_carrot = await multi.ReadFirstAsync<int>();
        var items = await multi.ReadAsync<TransactionDto>();

        return (items, totalCount_carrot);
    }

    public async Task<TransactionDto?> GetLatestAsync(int userId)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<TransactionDto>(
            @"SELECT TOP 1
                t.TransactionId, t.Amount, t.Type, t.TransactionDate, t.Note, t.CreatedAt,
                c.CategoryId, c.Name AS CategoryName, c.Icon AS CategoryIcon, c.Color AS CategoryColor
              FROM Transactions t
              INNER JOIN Categories c ON t.CategoryId = c.CategoryId
              WHERE t.UserId = @UserId
              ORDER BY t.CreatedAt DESC",
            new { UserId = userId }
        );
    }

    public async Task<MonthlySummaryDto> GetMonthlySummaryAsync(int userId, int year, int month)
    {
        using var conn = CreateConnection();
        return await conn.QueryFirstAsync<MonthlySummaryDto>(
            @"SELECT
                ISNULL(SUM(CASE WHEN Type = 'Income'  THEN Amount ELSE 0 END), 0) AS TotalIncome,
                ISNULL(SUM(CASE WHEN Type = 'Expense' THEN Amount ELSE 0 END), 0) AS TotalExpense,
                ISNULL(SUM(CASE WHEN Type = 'Income'  THEN Amount ELSE -Amount END), 0) AS NetAmount,
                COUNT(*) AS TransactionCount
              FROM Transactions
              WHERE UserId = @UserId
                AND YEAR(TransactionDate)  = @Year
                AND MONTH(TransactionDate) = @Month",
            new { UserId = userId, Year = year, Month = month }
        );
    }

    public async Task<IEnumerable<CategoryStatsDto>> GetCategoryStatsAsync(int userId, int year, int month)
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<CategoryStatsDto>(
            @"DECLARE @Total DECIMAL(18,2) = (
                SELECT ISNULL(SUM(Amount), 0) FROM Transactions
                WHERE UserId = @UserId AND Type = 'Expense'
                  AND YEAR(TransactionDate) = @Year AND MONTH(TransactionDate) = @Month
              );
              SELECT
                c.CategoryId,
                c.Name          AS CategoryName,
                c.Icon,
                c.Color,
                ISNULL(SUM(t.Amount), 0) AS TotalAmount,
                CASE WHEN @Total = 0 THEN 0
                     ELSE ROUND(ISNULL(SUM(t.Amount), 0) / @Total * 100, 2) END AS Percentage,
                COUNT(t.TransactionId) AS TransactionCount
              FROM Categories c
              LEFT JOIN Transactions t
                ON t.CategoryId = c.CategoryId AND t.UserId = @UserId
                   AND t.Type = 'Expense'
                   AND YEAR(t.TransactionDate) = @Year AND MONTH(t.TransactionDate) = @Month
              GROUP BY c.CategoryId, c.Name, c.Icon, c.Color
              HAVING ISNULL(SUM(t.Amount), 0) > 0
              ORDER BY TotalAmount DESC",
            new { UserId = userId, Year = year, Month = month }
        );
    }

    public async Task<IEnumerable<RecentActivityDto>> GetRecentActivitiesAsync(int userId, int limit)
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<RecentActivityDto>(
            @"SELECT TOP (@Limit)
                t.TransactionId, t.Amount, t.Type, t.TransactionDate, t.Note, t.CreatedAt,
                c.Icon AS CategoryIcon, c.Name AS CategoryName
              FROM Transactions t
              INNER JOIN Categories c ON t.CategoryId = c.CategoryId
              WHERE t.UserId = @UserId
              ORDER BY t.CreatedAt DESC",
            new { UserId = userId, Limit = limit }
        );
    }

    public async Task<IEnumerable<DailyPerformanceDto>> GetDailyPerformanceAsync(int userId, int days)
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<DailyPerformanceDto>(
            @"SELECT
                CAST(t.TransactionDate AS DATE) AS Date,
                ISNULL(SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE 0 END), 0) AS TotalIncome,
                ISNULL(SUM(CASE WHEN t.Type = 'Expense' THEN t.Amount ELSE 0 END), 0) AS TotalExpense,
                ISNULL(SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE -t.Amount END), 0) AS Net
              FROM Transactions t
              WHERE t.UserId = @UserId
                AND t.TransactionDate >= DATEADD(day, -@Days, CAST(GETDATE() AS DATE))
              GROUP BY CAST(t.TransactionDate AS DATE)
              ORDER BY Date ASC",
            new { UserId = userId, Days = days }
        );
    }
}
