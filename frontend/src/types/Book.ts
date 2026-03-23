// Matthew Andrus IS415 Mission 11
// This file serves as the shared TypeScript shape for book records returned by the backend API.
export type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

export type SortOrder = 'asc' | 'desc'

export type BrowseState = {
  pageSize: number
  pageNum: number
  sortOrder: SortOrder
  categories: string[]
}

export type CartItem = Book & {
  quantity: number
}
