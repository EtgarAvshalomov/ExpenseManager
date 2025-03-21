using ExpenseManagementAPI.Data;
using ExpenseManagementAPI.Models;
using ExpenseManagementAPI.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Configuration;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp",
		policy =>
		{
			policy.WithOrigins("http://localhost:3000", "http://localhost") // React app's URL
				  .AllowAnyHeader()
				  .AllowAnyMethod();
		});
});

var environment = builder.Environment.EnvironmentName;
string connectionString;

if (environment == "Docker")
{
	connectionString = builder.Configuration.GetConnectionString("DockerConnection");
}
else
{
	connectionString = builder.Configuration.GetConnectionString("LocalConnection");
}

builder.Services.AddDbContext<AuthDbContext>(options =>
options.UseSqlServer(connectionString));

builder.Services.AddScoped<TokenService>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
	.AddEntityFrameworkStores<AuthDbContext>()
	.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = (environment == "Docker") ? builder.Configuration["Jwt:DockerIssuer"] : builder.Configuration["Jwt:LocalIssuer"], // Set in appsettings.json
		ValidAudience = (environment == "Docker") ? builder.Configuration["Jwt:DockerAudience"] : builder.Configuration["Jwt:LocalAudience"], // Set in appsettings.json
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])), // Set in appsettings.json
		//ClockSkew = TimeSpan.FromSeconds(20) // Debugging purposes
		ClockSkew = TimeSpan.Zero
	};
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
	{
		Title = "Authorization Demo",
		Version = "v1"
	});

	options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
	{
		In = Microsoft.OpenApi.Models.ParameterLocation.Header,
		Description = "Description",
		Name = "Authorization",
		Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
		BearerFormat = "JWT",
		Scheme = "bearer"
	});

	options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type = ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			[]
		}
	});
});

builder.Services.AddDbContext<ApplicationDbContext>(options => 
options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

// Health check endpoint

app.MapGet("/api/health", () => Results.Ok("Healthy"));

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
