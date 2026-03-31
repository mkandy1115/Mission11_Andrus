// Matthew Andrus IS415 Mission 13
// Root shell: URL paths choose between the public bookstore and the admin CRUD screen.
import { Route, Routes } from 'react-router-dom'
import AdminBooks from './AdminBooks'
import BookstoreApp from './BookstoreApp'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/adminbooks" element={<AdminBooks />} />
      <Route path="/*" element={<BookstoreApp />} />
    </Routes>
  )
}

export default App
