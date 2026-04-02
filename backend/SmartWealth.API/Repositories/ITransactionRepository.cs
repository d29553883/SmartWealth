using SmartWealth.API.Models.DTOs;
using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface ITransactionRepository
{
    Task<int> CreateAsync(Transaction transaction);
    Task<(IEnumerable<TransactionDto> Items, int TotalCount)> GetPagedAsync(int userId, int page, int pageSize, string? type, int? categoryId, bool weekOnly);
    Task<TransactionDto?> GetLatestAsync(int userId);
    Task<MonthlySummaryDto> GetMonthlySummaryAsync(int userId, int year, int month);
    Task<IEnumerable<CategoryStatsDto>> GetCategoryStatsAsync(int userId, int year, int month);
    Task<IEnumerable<RecentActivityDto>> GetRecentActivitiesAsync(int userId, int limit);
    Task<IEnumerable<DailyPerformanceDto>> GetDailyPerformanceAsync(int userId, int days);
}
