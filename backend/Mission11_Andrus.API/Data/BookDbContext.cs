// Matthew Andrus IS415 Mission 11
// This file serves as the Entity Framework database context for accessing bookstore data.
using Microsoft.EntityFrameworkCore;

namespace Mission11_Andrus.API.Data
{
    public class BookDbContext : DbContext
    {
        // Pass the configured database options into the base DbContext.
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        // Expose the Books table so controllers can query it with EF Core.
        public DbSet<Book> Books { get; set; }
    }
}
