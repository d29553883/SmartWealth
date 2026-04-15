using SmartWealth.API.Models.Entities;

namespace SmartWealth.API.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int userId);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<int> CreateAsync(User user);
    Task<bool> ExistsAsync(string email);
    Task<User> FindOrCreateGoogleUserAsync(string googleId, string email, string fullName);
    Task UpdatePasswordAsync(int userId, string passwordHash);
    Task<IEnumerable<User>> GetAllAsync();
}
