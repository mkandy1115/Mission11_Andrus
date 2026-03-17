// Matthew Andrus IS415 Mission 11
// This file serves as the EF Core model for a single book record in the bookstore database.
using System.ComponentModel.DataAnnotations;

namespace Mission11_Andrus.API.Data
{
    public class Book
    {
        // Define the fields that map each book row from the SQLite database.
        [Key]
        public int BookID { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Author { get; set; } = string.Empty;

        [Required]
        public string Publisher { get; set; } = string.Empty;

        [Required]
        public string ISBN { get; set; } = string.Empty;

        [Required]
        public string Classification { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public int PageCount { get; set; }

        [Required]
        public double Price { get; set; }
    }
}
