// Matthew Andrus IS415 Mission 13
// Simple admin screen to add, edit, and delete books through the API.
import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from './api/BooksAPI'
import './App.css'
import type { Book } from './types/Book'

const emptyBook = (): Book => ({
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
})

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [form, setForm] = useState<Book>(emptyBook)

  const loadBooks = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      pageSize: '200',
      pageNum: '1',
      sortOrder: 'asc',
    })
    const response = await fetch(`${API_URL}/api/Books/AllBooks?${params}`)

    if (!response.ok) {
      setStatus('Could not load books. Is the API running?')
      setBooks([])
      setLoading(false)
      return
    }

    const data = (await response.json()) as { books: Book[] }
    setBooks(data.books)
    setLoading(false)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const saveBook = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('')

    const isNew = form.bookID === 0
    const url = isNew
      ? `${API_URL}/api/Books`
      : `${API_URL}/api/Books/UpdateBook/${form.bookID}`
    const method = isNew ? 'POST' : 'PUT'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      setStatus('Save failed. Check the form values and try again.')
      return
    }

    setForm(emptyBook())
    setStatus(isNew ? 'Book added.' : 'Book updated.')
    await loadBooks()
  }

  const deleteBook = async (bookID: number) => {
    if (!window.confirm('Delete this book from the database?')) {
      return
    }

    setStatus('')
    const response = await fetch(`${API_URL}/api/Books/DeleteBook/${bookID}`, {
      method: 'DELETE',
    })

    if (response.status === 404) {
      setStatus('That book was already removed.')
    } else if (!response.ok) {
      setStatus('Delete failed.')
      return
    }

    if (form.bookID === bookID) {
      setForm(emptyBook())
    }

    setStatus('Book deleted.')
    await loadBooks()
  }

  const startEdit = (book: Book) => {
    setStatus('')
    setForm({ ...book })
  }

  const cancelEdit = () => {
    setStatus('')
    setForm(emptyBook())
  }

  return (
    <section className="bookstore-shell admin-books">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <p className="eyebrow">Mission 13 Admin</p>
          <h1>Manage Books</h1>
          <p className="hero-copy mb-0">
            Add new titles, edit details, or remove rows. Changes write directly to the database.
          </p>
        </div>
        <div className="admin-actions d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-primary" to="/">
            Back to bookstore
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setStatus('')
              setForm(emptyBook())
            }}
          >
            Clear form (new book)
          </button>
        </div>
      </div>

      {status && <div className="alert alert-info py-2 mb-3">{status}</div>}

      <div className="row g-4 align-items-start">
        <div className="col-12">
          <div className="card shadow-sm border-0 admin-form-card">
            <div className="card-body">
              <h2 className="h5 mb-3">{form.bookID === 0 ? 'Add a book' : `Edit book #${form.bookID}`}</h2>
              <form className="admin-form" onSubmit={saveBook}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input
                      className="form-control"
                      required
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Publisher</label>
                    <input
                      className="form-control"
                      required
                      value={form.publisher}
                      onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ISBN</label>
                    <input
                      className="form-control"
                      required
                      value={form.isbn}
                      onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Classification</label>
                    <input
                      className="form-control"
                      required
                      value={form.classification}
                      onChange={(e) => setForm({ ...form, classification: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      className="form-control"
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Page count</label>
                    <input
                      className="form-control"
                      type="number"
                      min={1}
                      required
                      value={form.pageCount || ''}
                      onChange={(e) =>
                        setForm({ ...form, pageCount: Number.parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price</label>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={form.price || ''}
                      onChange={(e) =>
                        setForm({ ...form, price: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button className="btn btn-primary" type="submit">
                    {form.bookID === 0 ? 'Add book' : 'Save changes'}
                  </button>
                  {form.bookID !== 0 && (
                    <button className="btn btn-outline-secondary" type="button" onClick={cancelEdit}>
                      Cancel editing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Books in database</h2>
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={loadBooks}>
                  Refresh list
                </button>
              </div>
              {loading ? (
                <div className="text-center py-4 text-muted">Loading…</div>
              ) : books.length === 0 ? (
                <p className="text-muted mb-0">No books returned. Check the API connection.</p>
              ) : (
                <div className="table-responsive admin-table-wrap">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((b) => (
                        <tr key={b.bookID}>
                          <td>{b.bookID}</td>
                          <td>{b.title}</td>
                          <td>{b.author}</td>
                          <td>{b.category}</td>
                          <td className="text-end">${b.price.toFixed(2)}</td>
                          <td className="text-end text-nowrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => startEdit(b)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteBook(b.bookID)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminBooks
