using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class ExpenseBuyerDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BuyerFirstName",
                table: "Expenses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BuyerId",
                table: "Expenses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BuyerLastName",
                table: "Expenses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyerFirstName",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "BuyerId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "BuyerLastName",
                table: "Expenses");
        }
    }
}
