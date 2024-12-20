using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseManagementAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class FamiliesController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> _userManager;

		public FamiliesController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
	}
}
