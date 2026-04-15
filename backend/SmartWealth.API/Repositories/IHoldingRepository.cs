using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface IHoldingRepository
{
    Task<IEnumerable<Holding>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Holding>> GetAllAsync();
    Task<Holding?> GetByIdAsync(int holdingId, int userId);
    Task<int> CreateAsync(Holding holding);
    Task UpdatePriceAsync(int holdingId, int userId, decimal currentPrice);
    Task DeleteAsync(int holdingId, int userId);
}
