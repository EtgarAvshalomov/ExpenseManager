﻿using System.ComponentModel.DataAnnotations;

namespace ExpenseManagementAPI.Models.Entities
{
	public class Expense
	{
        public Guid Id { get; set; }

		[Required]
		public string? BuyerId { get; set; }

		[Required]
		public string? BuyerFirstName { get; set; }

		[Required]
		public string? BuyerLastName { get; set; }

		public decimal Price { get; set; }

		[Required(ErrorMessage = "Quantity is required.")]
		[Range(1, 10000, ErrorMessage = "Quantity range: 1 - 10,000")]
		public uint Quantity { get; set; }

		[Required(ErrorMessage = "Title is required.")]
		[StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
		public string? Title { get; set; }

		[StringLength(290, ErrorMessage = "Description cannot exceed 290 characters")]
		public string? Description { get; set; }

		public DateTime EventDateTime { get; set; }

		public bool Allowed { get; set; }
	}
}