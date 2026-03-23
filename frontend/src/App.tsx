// Matthew Andrus IS415 Mission 12
// This file serves as the root React component that renders the bookstore page.
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BookList from './BookList'
import CartView from './CartView'
import type { Book, BrowseState, CartItem } from './types/Book'

const CART_STORAGE_KEY = 'mission12-cart'
const BROWSE_STORAGE_KEY = 'mission12-browse-state'

// Define the default browsing options used when the user first opens the bookstore.
const defaultBrowseState: BrowseState = {
  pageSize: 5,
  pageNum: 1,
  sortOrder: 'asc',
  categories: [],
}

// Normalize saved session data so older single-category state still works with the new multi-select filter.
const normalizeBrowseState = (value: unknown): BrowseState => {
  if (!value || typeof value !== 'object') {
    return defaultBrowseState
  }

  const state = value as Partial<BrowseState> & { category?: string }

  return {
    pageSize: typeof state.pageSize === 'number' ? state.pageSize : 5,
    pageNum: typeof state.pageNum === 'number' ? state.pageNum : 1,
    sortOrder: state.sortOrder === 'desc' ? 'desc' : 'asc',
    categories: Array.isArray(state.categories)
      ? state.categories
      : state.category
        ? [state.category]
        : [],
  }
}

function App() {
  // Track the current view plus the cart and browsing state that should persist during the session.
  const [activeView, setActiveView] = useState<'books' | 'cart'>('books')
  const [browseState, setBrowseState] = useState<BrowseState>(() => {
    const storedState = sessionStorage.getItem(BROWSE_STORAGE_KEY)

    if (!storedState) {
      return defaultBrowseState
    }

    try {
      return normalizeBrowseState(JSON.parse(storedState))
    } catch {
      return defaultBrowseState
    }
  })
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY)

    if (!storedCart) {
      return []
    }

    try {
      return JSON.parse(storedCart) as CartItem[]
    } catch {
      return []
    }
  })

  // Save cart changes for the rest of the browser session.
  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // Save the user's current page, sort, and category selections for return navigation.
  useEffect(() => {
    sessionStorage.setItem(BROWSE_STORAGE_KEY, JSON.stringify(browseState))
  }, [browseState])

  // Add a book to the cart or increase the quantity if it is already there.
  const addToCart = (book: Book) => {
    setCartItems((currentCart) => {
      const existingItem = currentCart.find((item) => item.bookID === book.bookID)

      if (existingItem) {
        return currentCart.map((item) =>
          item.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...book, quantity: 1 }]
    })
  }

  // Adjust item quantities and remove the book if the quantity reaches zero.
  const updateQuantity = (bookID: number, change: number) => {
    setCartItems((currentCart) =>
      currentCart
        .map((item) =>
          item.bookID === bookID
            ? { ...item, quantity: Math.max(item.quantity + change, 0) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Calculate the cart totals once for display in both the bookstore and cart views.
  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )

  return activeView === 'books' ? (
    <BookList
      browseState={browseState}
      cartItemCount={cartItemCount}
      cartTotal={cartTotal}
      onAddToCart={addToCart}
      onBrowseStateChange={setBrowseState}
      onOpenCart={() => setActiveView('cart')}
    />
  ) : (
    <CartView
      cartItems={cartItems}
      cartTotal={cartTotal}
      onContinueShopping={() => setActiveView('books')}
      onUpdateQuantity={updateQuantity}
    />
  )
}

export default App
