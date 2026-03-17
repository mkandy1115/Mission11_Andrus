// Matthew Andrus IS415 Mission 11
// This file serves as the API controller that returns paged and sorted book data to the frontend.
using Microsoft.AspNetCore.Mvc;
using Mission11_Andrus.API.Data;

namespace Mission11_Andrus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _bookContext;

        // Receive the EF Core database context through dependency injection.
        public BooksController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc")
        {
            // Start with the full books table and then apply the requested sort order.
            var query = _bookContext.Books.AsQueryable();

            query = sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            // Return only the records needed for the current page.
            var respData = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Send both the current page of books and the total count for pagination.
            var totalNumBooks = _bookContext.Books.Count();

            var response = new
            {
                books = respData,
                totalNumBooks = totalNumBooks
            };

            return Ok(response);
        }
    }
}
