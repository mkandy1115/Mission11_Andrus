// Matthew Andrus IS415 Mission 13
// This file serves as the API controller for browsing, filtering, and admin CRUD on bookstore data.
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
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc", [FromQuery] string[]? categories = null)
        {
            // Start with the full books table, optionally filter by one or more categories, and then apply the requested sort order.
            var query = _bookContext.Books.AsQueryable();

            if (categories is { Length: > 0 })
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            query = sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            var totalNumBooks = query.Count();

            // Return only the records needed for the current page.
            var respData = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Send both the current page of books and the total count for pagination.
            var response = new
            {
                books = respData,
                totalNumBooks = totalNumBooks
            };

            return Ok(response);
        }

        [HttpGet("Categories")]
        public IActionResult GetCategories()
        {
            // Return the distinct book categories for the multi-select filter in the React app.
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(category => category)
                .ToList();

            return Ok(categories);
        }

        // Mission 13: insert a new book row and return the saved record (including generated BookID).
        [HttpPost]
        public IActionResult CreateBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Book payload is required.");
            }

            // Let the database assign the primary key for new rows.
            book.BookID = 0;
            _bookContext.Books.Add(book);
            _bookContext.SaveChanges();

            return Ok(book);
        }

        // Mission 13: update every column on an existing book when the IDs in the route and body match.
        [HttpPut("UpdateBook/{bookID:int}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Book payload is required.");
            }

            if (bookID != book.BookID)
            {
                return BadRequest("Route id and payload BookID must match.");
            }

            var existingBook = _bookContext.Books.Find(bookID);

            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Publisher = book.Publisher;
            existingBook.ISBN = book.ISBN;
            existingBook.Classification = book.Classification;
            existingBook.Category = book.Category;
            existingBook.PageCount = book.PageCount;
            existingBook.Price = book.Price;

            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        // Mission 13: remove a book row when the primary key exists.
        [HttpDelete("DeleteBook/{bookID:int}")]
        public IActionResult DeleteBook(int bookID)
        {
            var existingBook = _bookContext.Books.Find(bookID);

            if (existingBook == null)
            {
                return NotFound();
            }

            _bookContext.Books.Remove(existingBook);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
