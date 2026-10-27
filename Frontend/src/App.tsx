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
import UsersPage from "./pages/users/UsersPage";
import UserDetailsPage from "./pages/users/UserDetailsPage";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import ReviewDetailsPage from "./pages/reviews/ReviewDetailsPage";
import ReservationsPage from "./pages/reservations/ReservationsPage";
import ReservationDetailsPage from "./pages/reservations/ReservationDetailsPage";
import ReservationItemsPage from "./pages/reservation-items/ReservationItemsPage";
import ReservationItemDetailsPage from "./pages/reservation-items/ReservationItemDetailsPage";
import RequireRole from "./components/auth/RequireRole";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="books" element={<BooksPage />} />
        <Route path="books/new" element={<RequireRole roles={["ROLE_ADMIN"]}><BookCreatePage /></RequireRole>} />
        <Route path="books/:isbn/edit" element={<RequireRole roles={["ROLE_ADMIN"]}><BookEditPage /></RequireRole>} />
        <Route path="books/:isbn" element={<BookDetailsPage />} />

        <Route path="authors" element={<AuthorsPage />} />
        <Route path="authors/new" element={<RequireRole roles={["ROLE_ADMIN"]}><AuthorCreatePage /></RequireRole>} />
        <Route path="authors/:id/edit" element={<RequireRole roles={["ROLE_ADMIN"]}><AuthorEditPage /></RequireRole>} />
        <Route path="authors/:id" element={<AuthorDetailsPage />} />

        <Route path="users" element={<RequireRole roles={["ROLE_ADMIN"]}><UsersPage /></RequireRole>} />
        <Route path="users/:id" element={<RequireRole roles={["ROLE_ADMIN"]}><UserDetailsPage /></RequireRole>} />

        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reviews/:id" element={<ReviewDetailsPage />} />

        <Route path="reservations" element={<RequireRole roles={["ROLE_USER", "ROLE_ADMIN"]}><ReservationsPage /></RequireRole>} />
        <Route path="reservations/:id" element={<RequireRole roles={["ROLE_USER", "ROLE_ADMIN"]}><ReservationDetailsPage /></RequireRole>} />

        <Route path="reservation-items" element={<RequireRole roles={["ROLE_ADMIN"]}><ReservationItemsPage /></RequireRole>} />
        <Route path="reservation-items/:id" element={<RequireRole roles={["ROLE_ADMIN"]}><ReservationItemDetailsPage /></RequireRole>} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App
