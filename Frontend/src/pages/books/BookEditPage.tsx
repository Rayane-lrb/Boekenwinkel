import { Link, useNavigate, useParams } from "react-router-dom";
import BookForm from "../../components/books/BookForm";
import { useBook } from "../../hooks/useBooks";
import type { Book } from "../../types";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function BookEditPage() {
  const { isbn = "" } = useParams();
  const navigate = useNavigate();
  const bookQuery = useBook(isbn);

  const handleSaved = (book: Book) => {
    navigate(`/books/${encodeURIComponent(book.isbn)}`);
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link
          to={`/books/${encodeURIComponent(isbn)}`}
          className="text-sm font-medium text-[#9A7626] hover:underline"
        >
          ← Back to book details
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Edit book</h1>
      </header>
      {bookQuery.isLoading && <p className="text-slate-600">Loading book...</p>}
      {bookQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load book: {errorMessage(bookQuery.error)}
        </p>
      )}
      {bookQuery.data && <BookForm key={bookQuery.data.isbn} book={bookQuery.data} onSaved={handleSaved} />}
    </section>
  );
}
