using ExpenseManagementAPI.Models;
using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseManagementAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RolesController : ControllerBase
	{
		private readonly RoleManager<IdentityRole> _roleManager;
		private readonly UserManager<ApplicationUser> _userManager;

		public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
		{
			_roleManager = roleManager;
			_userManager = userManager;
		}

		// Creates new roles for user authorization
		/*
		[HttpPost("Create")]
		[Authorize]
		public async Task<IActionResult> CreateRole(string roleName)
		{
			if (!await _roleManager.RoleExistsAsync(roleName))
			{
				await _roleManager.CreateAsync(new IdentityRole(roleName));
				return Ok($"Role {roleName} created.");
			}
			return BadRequest($"Role {roleName} already exists.");
		}
		*/

		[HttpPost("Assign")]
		[Authorize]
		public async Task<IActionResult> AssignRole([FromBody] AssignRoleDTO assignRoleDTO)
		{
			var user = await _userManager.FindByIdAsync(assignRoleDTO.UserId);
			if (user != null && await _roleManager.RoleExistsAsync(assignRoleDTO.RoleName))
			{
				await _userManager.AddToRoleAsync(user, assignRoleDTO.RoleName);
				return Ok($"User {user.UserName} assigned to role {assignRoleDTO.RoleName}.");
			}
			return BadRequest("User or role does not exist.");
		}
	}
}
