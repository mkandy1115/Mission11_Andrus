// Matthew Andrus IS415 Mission 13
// This file serves as the main bookstore view with category filtering, pagination, cart summary, and data loading from the API.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from './api/BooksAPI'
import type { Book, BrowseState } from './types/Book'

type BookListProps = {
  browseState: BrowseState
  cartItemCount: number
  cartTotal: number
  onAddToCart: (book: Book) => void
  onBrowseStateChange: (browseState: BrowseState) => void
  onOpenCart: () => void
}

function BookList({
  browseState,
  cartItemCount,
  cartTotal,
  onAddToCart,
  onBrowseStateChange,
  onOpenCart,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { pageSize, pageNum, sortOrder, categories: selectedCategories } = browseState
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const selectedCategoryLabel =
    selectedCategories.length === 0 ? 'All Categories' : selectedCategories.join(', ')

  useEffect(() => {
    // Load the available category filters once when the bookstore page opens.
    const fetchCategories = async () => {
      const response = await fetch(`${API_URL}/api/Books/Categories`)
      const data = (await response.json()) as string[]

      setCategories(data)
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    // Request the current page of books whenever paging, sorting, or selected categories change.
    const fetchBooks = async () => {
      setIsLoading(true)

      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageNum: pageNum.toString(),
        sortOrder,
      })

      selectedCategories.forEach((selectedCategory) => {
        params.append('categories', selectedCategory)
      })

      const response = await fetch(
        `${API_URL}/api/Books/AllBooks?${params.toString()}`
      )

      const data = await response.json()
      const fetchedTotal = data.totalNumBooks as number
      const lastAvailablePage = Math.max(1, Math.ceil(fetchedTotal / pageSize))

      setBooks(data.books)
      setTotalItems(fetchedTotal)
      setIsLoading(false)

      if (pageNum > lastAvailablePage) {
        onBrowseStateChange({ ...browseState, pageNum: lastAvailablePage })
      }
    }

    fetchBooks()
  }, [browseState, onBrowseStateChange, pageNum, pageSize, selectedCategories, sortOrder])

  const startRecord = totalItems === 0 ? 0 : (pageNum - 1) * pageSize + 1
  const endRecord = Math.min(pageNum * pageSize, totalItems)
  const pageButtons = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  )

  // Merge changes into the shared browsing state kept in the parent component.
  const updateBrowseState = (updates: Partial<BrowseState>) => {
    onBrowseStateChange({ ...browseState, ...updates })
  }

  // Toggle individual categories on and off while resetting to the first page of results.
  const toggleCategory = (categoryOption: string) => {
    const nextCategories = selectedCategories.includes(categoryOption)
      ? selectedCategories.filter((selectedCategory) => selectedCategory !== categoryOption)
      : [...selectedCategories, categoryOption]

    updateBrowseState({ categories: nextCategories, pageNum: 1 })
  }

  return (
    <section className="bookstore-shell container-fluid">
      <div className="row g-4 align-items-start">
        <div className="col-12">
          <div className="bookstore-hero card border-0 shadow-sm overflow-hidden">
            <div className="card-body hero-panel">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3">
                <div>
                  <h1>Hilton&apos;s BookStore</h1>
                  <p className="hero-copy">
                    Brows the Bookstore Collection
                  </p>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                  <Link className="btn btn-outline-secondary btn-lg" to="/adminbooks">
                    Admin books
                  </Link>
                  <button className="btn btn-primary btn-lg" onClick={onOpenCart}>
                    View Cart ({cartItemCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-12 col-lg-4 col-xl-3">
          <div className="d-grid gap-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                {/* TA: Note Present the category filters as a list-group with checkbox-style multi-select controls. */}
                <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                  <h2 className="h4 mb-0">Browse Categories</h2>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => updateBrowseState({ categories: [], pageNum: 1 })}
                    disabled={selectedCategories.length === 0}
                  >
                    Clear
                  </button>
                </div>
                {/* TA note: Mission12 Bootstrap additions are the `list-group` checkbox-style category filter here and the `accordion` book details in the results list below. */}
                <div className="list-group category-list">
                  {categories.map((categoryOption) => {
                    const isSelected = selectedCategories.includes(categoryOption)

                    return (
                      <button
                        key={categoryOption}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                          isSelected ? 'active' : ''
                        }`}
                        onClick={() => toggleCategory(categoryOption)}
                      >
                        <span className="d-flex align-items-center gap-3">
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            aria-label={`Select ${categoryOption}`}
                          />
                          <span>{categoryOption}</span>
                        </span>
                        {isSelected && (
                          <span className="badge text-bg-light text-dark rounded-pill">On</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 cart-summary-card">
              <div className="card-body">
                <h2 className="h4 mb-3">Cart Summary</h2>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items in cart</span>
                  <span className="fw-semibold">{cartItemCount}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-outline-primary w-100" onClick={onOpenCart}>
                  Open Cart
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="col-12 col-lg-8 col-xl-9">
          <div className="control-panel card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Sort by title</label>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() =>
                      updateBrowseState({
                        sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
                        pageNum: 1,
                      })
                    }
                  >
                    {sortOrder === 'asc' ? 'Title: A to Z' : 'Title: Z to A'}
                  </button>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Results per page</label>
                  <select
                    className="form-select"
                    value={pageSize}
                    onChange={(event) =>
                      updateBrowseState({
                        pageSize: Number(event.target.value),
                        pageNum: 1,
                      })
                    }
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <div className="results-summary">
                    Showing {startRecord}-{endRecord} of {totalItems} books in {selectedCategoryLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading books...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Render each book as an accordion item so the summary stays compact and the details expand on demand. */}
              <div className="accordion book-accordion" id="book-details-accordion">
                {books.map((b) => {
                  // Build unique IDs so each accordion header controls its own details panel.
                  const collapseId = `book-details-${b.bookID}`
                  const headingId = `book-heading-${b.bookID}`

                  return (
                    <div className="accordion-item book-card shadow-sm border-0 mb-3" key={b.bookID}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className="accordion-button collapsed book-accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded="false"
                          aria-controls={collapseId}
                        >
                          <div className="w-100">
                            {/* Keep the collapsed view focused on the category, title, and author only. */}
                            <div className="book-meta mb-2">
                              <span className="badge text-bg-warning-subtle text-dark border">
                                {b.category}
                              </span>
                            </div>
                            <div className="compact-book-row">
                              <h3 className="book-title mb-1">{b.title}</h3>
                              <p className="book-author mb-0">by {b.author}</p>
                            </div>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className="accordion-collapse collapse"
                        aria-labelledby={headingId}
                        data-bs-parent="#book-details-accordion"
                      >
                        <div className="accordion-body">
                          {/* Show the primary purchase details in the first row of the expanded section. */}
                          <div className="row g-3 mb-3">
                            <div className="col-md-4">
                              <div className="detail-label">Price</div>
                              <div className="fw-semibold">${b.price.toFixed(2)}</div>
                            </div>
                            <div className="col-md-4">
                              <div className="detail-label">Publisher</div>
                              <div>{b.publisher}</div>
                            </div>
                            <div className="col-md-4">
                              <div className="detail-label">Pages</div>
                              <div>{b.pageCount}</div>
                            </div>
                          </div>
                          {/* Place the ISBN, classification, and cart action in a second row below the details. */}
                          <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                              <div className="detail-label">ISBN</div>
                              <div>{b.isbn}</div>
                            </div>
                            <div className="col-md-4">
                              <div className="detail-label">Classification</div>
                              <div>{b.classification}</div>
                            </div>
                            <div className="col-md-4">
                              <button
                                className="btn btn-success w-100"
                                onClick={() => onAddToCart(b)}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pagination-bar">
                <button
                  className="btn btn-outline-secondary"
                  disabled={pageNum === 1}
                  onClick={() => updateBrowseState({ pageNum: pageNum - 1 })}
                >
                  Previous
                </button>

                <div className="page-buttons">
                  {pageButtons.map((page) => (
                    <button
                      key={page}
                      className={`btn ${pageNum === page ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => updateBrowseState({ pageNum: page })}
                      disabled={pageNum === page}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-outline-secondary"
                  disabled={pageNum === totalPages || totalItems === 0}
                  onClick={() => updateBrowseState({ pageNum: pageNum + 1 })}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookList
