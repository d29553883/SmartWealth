using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int userId);
    Task<int> CreateAsync(User user);
    Task<bool> ExistsAsync(string email);
}
