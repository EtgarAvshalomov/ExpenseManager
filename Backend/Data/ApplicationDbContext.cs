using ExpenseManagementAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagementAPI.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

		public DbSet<Expense> Expenses { get; set; }
	}
}
