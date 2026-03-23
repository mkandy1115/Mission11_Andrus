// Matthew Andrus IS415 Mission 11
// This file serves as the shopping cart view for Mission 12.
import type { CartItem } from './types/Book'

type CartViewProps = {
  cartItems: CartItem[]
  cartTotal: number
  onContinueShopping: () => void
  onUpdateQuantity: (bookID: number, change: number) => void
}

function CartView({
  cartItems,
  cartTotal,
  onContinueShopping,
  onUpdateQuantity,
}: CartViewProps) {
  return (
    <section className="bookstore-shell">
      {/* Show the cart heading and provide a quick way back to the saved bookstore view. */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <p className="eyebrow">Mission 12 Cart</p>
          <h1>Your Shopping Cart</h1>
          <p className="hero-copy">
            Review quantities, see line subtotals, and jump back into the exact browsing session you left.
          </p>
        </div>

        <button className="btn btn-outline-primary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>

      {/* Display either an empty-cart message or the full cart table with totals. */}
      {cartItems.length === 0 ? (
        <div className="card shadow-sm border-0 empty-cart-card">
          <div className="card-body text-center py-5">
            <h2 className="mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Add a few titles from the bookstore and they will stay here for the rest of this session.
            </p>
            <button className="btn btn-primary" onClick={onContinueShopping}>
              Browse Books
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-12 col-xl-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                {/* List each cart item with quantity controls and line subtotals. */}
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Book</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.bookID}>
                          <td>
                            <div className="fw-semibold">{item.title}</div>
                            <div className="text-muted small">by {item.author}</div>
                            <div className="text-muted small">{item.category}</div>
                          </td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label={`Quantity controls for ${item.title}`}>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => onUpdateQuantity(item.bookID, -1)}
                              >
                                -
                              </button>
                              <span className="btn btn-light disabled quantity-pill">{item.quantity}</span>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => onUpdateQuantity(item.bookID, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="card shadow-sm border-0 cart-total-card">
              <div className="card-body">
                {/* Summarize the total quantity and price for the current cart. */}
                <h2 className="h4 mb-3">Order Summary</h2>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items</span>
                  <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100" disabled>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CartView
