using System.ComponentModel.DataAnnotations;

namespace ExpenseManagementAPI.Models
{
	public class AssignRoleDTO
	{
        [Required]
        public string? UserId { get; set; }
		[Required]
		public string? RoleName { get; set; }
    }
}
