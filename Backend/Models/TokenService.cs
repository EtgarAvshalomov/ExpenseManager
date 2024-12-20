using ExpenseManagementAPI.Data;
using ExpenseManagementAPI.Migrations.AuthDb;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagementAPI.Models
{
	public class TokenService
	{
        private readonly AuthDbContext _dbContext;
        public TokenService(AuthDbContext dbContext)
        {
            _dbContext = dbContext;
        }
		public async Task<RefreshToken> GetRefreshTokenAsync(string userId)
		{
			return await _dbContext.RefreshTokens
						.Where(rt => rt.UserId == userId && !rt.IsRevoked && rt.Expiration > DateTime.Now && !rt.IsUsed)
						.OrderByDescending(rt => rt.Expiration)
						.FirstOrDefaultAsync();
		}
		public async Task<bool> RevokeRefreshTokenAsync(RefreshToken refreshToken)
		{
			if (refreshToken == null || refreshToken.IsRevoked || refreshToken.Expiration < DateTime.Now || refreshToken.IsUsed)
			{
				return false;
			}
			refreshToken.IsRevoked = true;
			_dbContext.RefreshTokens.Update(refreshToken);
			await _dbContext.SaveChangesAsync();

			return true;
		}
	}
}
