using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface IPriceAlertRepository
{
    Task<IEnumerable<PriceAlert>> GetByUserIdAsync(int userId);
    Task<PriceAlert?> GetByIdAsync(int alertId, int userId);
    Task<IEnumerable<PriceAlert>> GetAllActiveAsync();
    Task<int> CreateAsync(PriceAlert alert);
    Task DeactivateAsync(int alertId);
    Task UpdateAsync(int alertId, int userId, string condition, decimal targetPrice);
    Task DeleteAsync(int alertId, int userId);
}
