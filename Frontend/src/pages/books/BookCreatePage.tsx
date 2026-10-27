import { Link, useNavigate } from "react-router-dom";
import BookForm from "../../components/books/BookForm";
import type { Book } from "../../types";

export default function BookCreatePage() {
  const navigate = useNavigate();

  const handleSaved = (book: Book) => {
    navigate(`/books/${encodeURIComponent(book.isbn)}`);
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/books" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to books
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Create a book</h1>
        <p className="text-sm text-slate-600">Enter the details for the new book.</p>
      </header>
      <BookForm onSaved={handleSaved} />
    </section>
  );
}
