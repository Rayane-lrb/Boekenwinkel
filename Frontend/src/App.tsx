import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/books/BooksPage";
import BookCreatePage from "./pages/books/BookCreatePage";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import BookEditPage from "./pages/books/BookEditPage";
import AuthorsPage from "./pages/authors/AuthorsPage";
import AuthorCreatePage from "./pages/authors/AuthorCreatePage";
import AuthorDetailsPage from "./pages/authors/AuthorDetailsPage";
import AuthorEditPage from "./pages/authors/AuthorEditPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/new" element={<BookCreatePage />} />
        <Route path="books/:isbn/edit" element={<BookEditPage />} />
        <Route path="books/:isbn" element={<BookDetailsPage />} />
        <Route path="authors" element={<AuthorsPage />} />
        <Route path="authors/new" element={<AuthorCreatePage />} />
        <Route path="authors/:id/edit" element={<AuthorEditPage />} />
        <Route path="authors/:id" element={<AuthorDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App
