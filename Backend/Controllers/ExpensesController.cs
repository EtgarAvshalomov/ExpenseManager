using ExpenseManagementAPI.Data;
using ExpenseManagementAPI.Models;
using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace ExpenseManagementAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ExpensesController : ControllerBase
	{
		private readonly ApplicationDbContext dbContext;
		private readonly AuthDbContext dbContextAuth;
		private readonly UserManager<ApplicationUser> _userManager;

		public ExpensesController(ApplicationDbContext dbContext, AuthDbContext dbContextAuth, UserManager<ApplicationUser> userManager)
        {
			this.dbContext = dbContext;
			this.dbContextAuth = dbContextAuth;
			this._userManager = userManager;
		}

        [HttpGet]
		[Authorize]
		public async Task<IActionResult> GetAllExpenses()
		{
			var expenses = await dbContext.Expenses.ToListAsync();
			return Ok(expenses);
		}

		[HttpGet("Family")]
		[Authorize]
		public async Task<IActionResult> GetFamilyExpenses([FromQuery] DateTime? dateTimeStart, DateTime? dateTimeEnd)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return StatusCode(401, "User information not found in the token");
			}

			var user = await _userManager.FindByIdAsync(userId);
			if (user == null)
			{
				return StatusCode(404, "User not found");
			}

			var expenses = await dbContext.Expenses.ToListAsync();

			var familyExpenses = expenses
				.Where(expense => expense.BuyerId != null &&
								  (dateTimeEnd == null || expense.EventDateTime.Date >= dateTimeStart) &&
								  (dateTimeStart == null || expense.EventDateTime.Date <= dateTimeEnd) &&
								  dbContextAuth.Users
								  .Any(buyer => buyer.Id == expense.BuyerId &&
										buyer.FamilyId == user.FamilyId)).ToList();

			return Ok(familyExpenses);
		}

		[HttpGet]
		[Route("{id:guid}")]
		[Authorize]
		public async Task<IActionResult> GetExpenseById(Guid id)
		{
			var expense = await dbContext.Expenses.FindAsync(id);
			if (expense == null)
			{
				return StatusCode(404, "Expense not found");
			}
			return Ok(expense);
		}

		[HttpPost]
		[Route("Add")]
		[Authorize]
		public async Task<IActionResult> AddExpense(AddExpenseDTO addExpenseDTO)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return StatusCode(401, "User information not found in the token");
			}

			var user = await _userManager.FindByIdAsync(userId);
			if (user == null)
			{
				return StatusCode(404, "User not found");
			}

			var expense = new Expense
			{
				BuyerId = user.Id,
				BuyerFirstName = user.FirstName,
				BuyerLastName = user.LastName,
				Title = addExpenseDTO.Title,
				Price = addExpenseDTO.Price,
				Quantity = addExpenseDTO.Quantity,
				Description = addExpenseDTO.Description,
				EventDateTime = DateTime.UtcNow
			};

			await dbContext.Expenses.AddAsync(expense);
			await dbContext.SaveChangesAsync();

			return Created(string.Empty, expense);
		}

		[HttpPut]
		[Route("Edit/{id:guid}")]
		[Authorize]
		public async Task<IActionResult> EditExpense(Guid id, EditExpenseDTO editExpenseDTO)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return StatusCode(401, "User information not found in the token");
			}

			var user = await _userManager.FindByIdAsync(userId);
			if (user == null)
			{
				return StatusCode(404, "User not found");
			}

			var expense = await dbContext.Expenses.FindAsync(id);
			if (expense == null)
			{
				return StatusCode(404, "Expense not found");
			}
			if(expense.Allowed == true)
			{
				return StatusCode(403, "You cannot edit an allowed expenses");
			}

			if (expense.BuyerId != user.Id)
			{
				return StatusCode(403, "You cannot edit other users expenses");
			}

			expense.Title = editExpenseDTO.Title;
			expense.Price = editExpenseDTO.Price;
			expense.Quantity = editExpenseDTO.Quantity;
			expense.Description = editExpenseDTO.Description;

			await dbContext.SaveChangesAsync();

			return Ok(expense);
		}

		[HttpPut]
		[Route("Authorize/{id:guid}")]
		[Authorize(Roles = "Adult")]
		public async Task<IActionResult> AuthorizeExpense(Guid id)
		{
			var expense = await dbContext.Expenses.FindAsync(id);
			if (expense == null)
			{
				return StatusCode(404, "Expense not found");
			}
			if (expense.Allowed == true) 
			{
				return StatusCode(401, "Expense has already been allowed");
			}

			expense.Allowed = true;

			await dbContext.SaveChangesAsync();

			return Ok(expense);
		}

		[HttpDelete]
		[Route("Delete/{id:guid}")]
		[Authorize]
		public async Task<IActionResult> DeleteExpense(Guid id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return StatusCode(401, "User information not found in the token");
			}

			var user = await _userManager.FindByIdAsync(userId);
			if (user == null)
			{
				return StatusCode(404, "User not found");
			}

			var expense = await dbContext.Expenses.FindAsync(id);
			if(expense == null)
			{
				return StatusCode(404, "Expense not found");
			}

			if (expense.Allowed == true)
			{
				return StatusCode(403, "You cannot delete an allowed expenses");
			}

			if (expense.BuyerId != user.Id)
			{
				return StatusCode(403, "You cannot delete other users expenses");
			}

			dbContext.Expenses.Remove(expense);
			await dbContext.SaveChangesAsync();

			return NoContent();
		}
	}
}
