using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int categoryId);
}
