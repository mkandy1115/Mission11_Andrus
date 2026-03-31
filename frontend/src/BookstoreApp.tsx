// Matthew Andrus IS415 Mission 13
// Bookstore + cart experience shown at the site root.
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BookList from './BookList'
import CartView from './CartView'
import type { Book, BrowseState, CartItem } from './types/Book'

const CART_STORAGE_KEY = 'mission12-cart'
const BROWSE_STORAGE_KEY = 'mission12-browse-state'

const defaultBrowseState: BrowseState = {
  pageSize: 5,
  pageNum: 1,
  sortOrder: 'asc',
  categories: [],
}

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

function BookstoreApp() {
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

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    sessionStorage.setItem(BROWSE_STORAGE_KEY, JSON.stringify(browseState))
  }, [browseState])

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

export default BookstoreApp
