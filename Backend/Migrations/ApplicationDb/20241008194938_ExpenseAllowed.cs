using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class ExpenseAllowed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Allowed",
                table: "Expenses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allowed",
                table: "Expenses");
        }
    }
}
