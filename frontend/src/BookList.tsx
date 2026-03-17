// Matthew Andrus IS415 Mission 11
// This file serves as the main bookstore view with sorting, pagination, and data loading from the API.
import { useEffect, useState } from 'react'
import type { Book } from './types/Book'

function BookList() {
  // Track the books returned by the API along with the current paging and sorting state.
  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState<number>(5)
  const [pageNum, setPageNum] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Request a fresh page of books whenever the paging or sort settings change.
    const fetchBooks = async () => {
      setIsLoading(true)

      const response = await fetch(
        `https://localhost:5000/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
      )

      const data = await response.json()

      setBooks(data.books)
      setTotalItems(data.totalNumBooks)
      setTotalPages(Math.ceil(totalItems / pageSize))
      setIsLoading(false)
    }

    fetchBooks()
  }, [pageSize, pageNum, ,totalItems, sortOrder])

  // Calculate the record range shown in the summary text above the results.
  const startRecord = totalItems === 0 ? 0 : (pageNum - 1) * pageSize + 1
  const endRecord = Math.min(pageNum * pageSize, totalItems)

  return (
    <>
      <section className="bookstore-shell">
        {/* Present the page title and a short description for the bookstore. */}
        <div className="bookstore-hero">
          <h1>Hilton's BookStore</h1>
          <p className="hero-copy">
            Browse the bookstore collection
          </p>
        </div>

        {/* Let the user control sorting, page size, and see how many results are currently shown. */}
        <div className="control-panel card shadow-sm border-0">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Sort by title</label>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    setPageNum(1)
                  }}
                >
                  {sortOrder === 'asc' ? 'Title: A to Z' : 'Title: Z to A'}
                </button>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Results per page</label>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(p) => {
                    setPageSize(Number(p.target.value))
                    setPageNum(1)
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>

              <div className="col-md-4">
                <div className="results-summary">
                  Showing {startRecord}-{endRecord} of {totalItems} books
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show a spinner while the API request is in progress, then render the results and pagination. */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading books...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Render one card for each book returned on the current page. */}
            <div className="row g-4">
              {books.map((b) => (
                <div className="col-12" key={b.bookID}>
                  <div className="card book-card shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
                        <div>
                          <div className="book-meta mb-2">
                            <span className="badge text-bg-light border">
                              {b.classification}
                            </span>
                            <span className="badge text-bg-warning-subtle text-dark border">
                              {b.category}
                            </span>
                          </div>
                          <h2 className="book-title">{b.title}</h2>
                          <p className="book-author mb-0">by {b.author}</p>
                        </div>

                        <div className="price-pill">${b.price.toFixed(2)}</div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <div className="detail-label">Publisher</div>
                          <div>{b.publisher}</div>
                        </div>
                        <div className="col-md-4">
                          <div className="detail-label">ISBN</div>
                          <div>{b.isbn}</div>
                        </div>
                        <div className="col-md-4">
                          <div className="detail-label">Pages</div>
                          <div>{b.pageCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Build pagination buttons from the total number of pages in the dataset. */}
            <div className="pagination-bar">
              <button
                className="btn btn-outline-secondary"
                disabled={pageNum === 1}
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>

              <div className="page-buttons">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`btn ${
                      pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setPageNum(i + 1)}
                    disabled={pageNum === i + 1}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-outline-secondary"
                disabled={pageNum === totalPages || totalPages === 0}
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default BookList
