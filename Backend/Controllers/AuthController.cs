using ExpenseManagementAPI.Data;
using ExpenseManagementAPI.Models;
using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol.Plugins;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ExpenseManagementAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AuthDbContext _dbContext;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;
		private readonly SignInManager<ApplicationUser> _signInManager;
		private readonly IConfiguration _configuration;
		private readonly TokenService _tokenService;
		private readonly IHostEnvironment _environment;

		public AuthController(AuthDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, TokenService tokenService, IHostEnvironment environment)
		{
			_dbContext = dbContext;
			_userManager = userManager;
			_roleManager = roleManager;
			_signInManager = signInManager;
			_configuration = configuration;
			_tokenService = tokenService;
			_environment = environment;
		}

		[HttpPost]
		[Route("Register")] // /Register?familyId=????????-????-????-????-????????????
		public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto, [FromQuery] Guid? familyId)
		{
			var user = new ApplicationUser { UserName = registerDto.Email, Email = registerDto.Email, FirstName = registerDto.FirstName, LastName = registerDto.LastName};
			user.FamilyId = familyId ?? Guid.NewGuid();
			var result = await _userManager.CreateAsync(user, registerDto.Password);
			var roleName = "Adult";

			if (!result.Succeeded)
			{
				var errorMessages = result.Errors.Select(e => e.Description).ToList();
				return BadRequest(new { Errors = errorMessages });
			}

			if (registerDto.Adult)
			{
				if (user == null || !await _roleManager.RoleExistsAsync(roleName))
				{
					return BadRequest("User or role do not exist.");
				}

				await _userManager.AddToRoleAsync(user, roleName);
			}

			if (registerDto.Adult)
			{
				return StatusCode(201, $"User registered successfully and assigned to role {roleName}.");
			}

			return StatusCode(201, "User registered successfully");
		}

		private async Task<JwtSecurityToken> GenerateJwtToken(ApplicationUser user)
		{
			var userRoles = await _userManager.GetRolesAsync(user);  // Fetch roles for the user

			var claims = new List<Claim>
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Id),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
			};

			// Add the roles as claims
			foreach (var role in userRoles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role));
			}

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: (_environment.EnvironmentName == "Docker") ? _configuration["Jwt:DockerIssuer"] : _configuration["Jwt:LocalIssuer"],
				audience: (_environment.EnvironmentName == "Docker") ? _configuration["Jwt:DockerAudience"] : _configuration["Jwt:LocalAudience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(15),
				signingCredentials: creds);

			return token;
		}

		private string GenerateRandomToken()
		{
			var randomBytes = new byte[64];
			using (var rng = RandomNumberGenerator.Create())
			{
				rng.GetBytes(randomBytes);
				return Convert.ToBase64String(randomBytes);
			}
		}

		private async Task<RefreshToken> CreateRefreshTokenAsync(ApplicationUser user)
		{
			var refreshToken = new RefreshToken
			{
				Token = GenerateRandomToken(),
				UserId = user.Id,
				Expiration = DateTime.UtcNow.AddDays(7),
				IsRevoked = false,
				IsUsed = false
			};

			_dbContext.RefreshTokens.Add(refreshToken);
			await _dbContext.SaveChangesAsync();
			return refreshToken;
		}

		[HttpPost]
		[Route("Login")]
		public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
		{
			var user = await _userManager.FindByNameAsync(loginRequest.Email);
			if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
			{
				return Unauthorized();
			}

			var accessToken = await GenerateJwtToken(user);
			var refreshToken = await CreateRefreshTokenAsync(user);

			return Ok(new
			{
				AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
				AccessTokenExpiration = accessToken.ValidTo,
				RefreshToken = refreshToken.Token,
				RefreshTokenExpiration = refreshToken.Expiration.ToString("o"), // ISO 8601 format
				UserId = user.Id,
				FamilyId = user.FamilyId,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email
			});
		}

		[HttpPost]
		[Route("Logout")]
		public async Task<IActionResult> Logout()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null)
			{
				return StatusCode(401, "User information not found in the token");
			}

			var refreshToken = await _tokenService.GetRefreshTokenAsync(userId);

			if (refreshToken == null)
			{
				return StatusCode(404, "Refresh token not found");
			}
			
			await _tokenService.RevokeRefreshTokenAsync(refreshToken);

			return Ok("Logged out successfully");
		}

		[HttpPost("Refresh-Token")]
		public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest model)
		{
			var refreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(t => t.Token == model.RefreshToken);

			if (refreshToken == null || refreshToken.IsRevoked || refreshToken.Expiration < DateTime.UtcNow || refreshToken.IsUsed)
			{
				return Unauthorized();
			}

			// Mark the old refresh token as used
			refreshToken.IsUsed = true;
			await _dbContext.SaveChangesAsync();

			// Generate a new access token
			var user = await _userManager.FindByIdAsync(refreshToken.UserId);
			var newAccessToken = await GenerateJwtToken(user);

			// Generate a new refresh token
			var newRefreshToken = await CreateRefreshTokenAsync(user);

			return Ok(new
			{
				AccessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
				AccessTokenExpiration = newAccessToken.ValidTo,
				RefreshToken = newRefreshToken.Token,
				RefreshTokenExpiration = newRefreshToken.Expiration.ToString("o"), // ISO 8601 format
				UserId = user.Id,
				FamilyId = user.FamilyId,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email
			});
		}

		private bool IsTokenExpired(string token)
		{
			var handler = new JwtSecurityTokenHandler();
			var jwtToken = handler.ReadJwtToken(token);
			var exp = jwtToken.ValidTo;

			return exp < DateTime.UtcNow;
		}

		// Validate an access token
		[HttpGet("Validate-Token")]
		[Authorize]
		public async Task<IActionResult> ValidateAccessToken()
		{

			string authorizationHeader = Request.Headers["Authorization"];

			if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
			{
				return BadRequest("Authorization header not found.");
			}

			string token = authorizationHeader.Substring("Bearer ".Length).Trim();

			// Check if the token is expired
			bool isExpired = IsTokenExpired(token);

			if (isExpired)
			{
				return Unauthorized();
			}

			return Ok();
		}

		// Validate an adults access token
		[HttpGet("Validate-Adult-Token")]
		[Authorize(Roles = "Adult")]
		public async Task<IActionResult> ValidateAdultAccessToken()
		{
			string authorizationHeader = Request.Headers["Authorization"];

			if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
			{
				return BadRequest("Authorization header not found.");
			}

			string token = authorizationHeader.Substring("Bearer ".Length).Trim();

			// Check if the token is expired
			bool isExpired = IsTokenExpired(token);

			if (isExpired)
			{
				return Unauthorized();
			}

			return Ok();
		}
	}
}