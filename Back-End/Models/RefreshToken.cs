using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace ExpenseManagementAPI.Models
{
	public class RefreshToken
	{
		public int Id { get; set; }
		public string Token { get; set; }
		public string UserId { get; set; }
		public ApplicationUser User { get; set; }
		public DateTime Expiration { get; set; }
		public bool IsRevoked { get; set; }
		public bool IsUsed { get; set; }
	}
}
