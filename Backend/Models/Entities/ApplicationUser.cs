using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace ExpenseManagementAPI.Models.Entities
{
	public class ApplicationUser : IdentityUser
	{
        public Guid FamilyId { get; set; }

		[Required]
		public string? FirstName { get; set; }

		[Required]
		public string? LastName { get; set; }
	}
}
