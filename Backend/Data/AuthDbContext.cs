using ExpenseManagementAPI.Models;
using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace ExpenseManagementAPI.Data
{
	public class AuthDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
	{
		public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) {}

		public DbSet<RefreshToken> RefreshTokens { get; set; }
	}
}
