// Matthew Andrus IS415 Mission 11
// This file serves as a simple container for a page of books and the total number of books available.
namespace Mission11_Andrus.API.Data
{
    public class BookListData
    {
        // Store the current page of results along with the full count used for pagination.
        public List<Book> Books { get; set; } = new List<Book>();
        public int TotalNumBooks { get; set; }
    }
}
