import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteBook, useBook } from "../../hooks/useBooks";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function BookDetailsPage() {
  const { isbn = "" } = useParams();
  const navigate = useNavigate();
  const bookQuery = useBook(isbn);
  const deleteBook = useDeleteBook();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = () => {
    const book = bookQuery.data;
    if (!book || !window.confirm(`Delete "${book.title}"? This action cannot be undone.`)) return;

    setDeleteError(null);
    deleteBook.mutate(book.isbn, {
      onSuccess: () => navigate("/books"),
      onError: (error) => setDeleteError(errorMessage(error)),
    });
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/books" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to books
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Book details</h1>
      </header>

      {bookQuery.isLoading && <p className="text-slate-600">Loading book...</p>}
      {bookQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load book: {errorMessage(bookQuery.error)}
        </p>
      )}
      {bookQuery.data && (
        <article className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">
              {bookQuery.data.authorFirstName} {bookQuery.data.authorLastName}
            </p>
            <h2 className="text-2xl font-bold text-blue-950">{bookQuery.data.title}</h2>
            <p className="text-sm text-slate-500">ISBN: {bookQuery.data.isbn}</p>
          </div>

          <dl className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Price</dt>
              <dd className="mt-1 font-semibold text-blue-950">€{bookQuery.data.price.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Available stock</dt>
              <dd className="mt-1 font-semibold text-blue-950">{bookQuery.data.stock}</dd>
            </div>
          </dl>

          <div>
            <h3 className="font-semibold text-blue-950">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {bookQuery.data.description || "No description available."}
            </p>
          </div>

          {deleteError && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              Could not delete the book: {deleteError}
            </p>
          )}
          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Link
              to={`/books/${encodeURIComponent(bookQuery.data.isbn)}/edit`}
              className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400"
            >
              Edit book
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteBook.isPending}
              className="rounded-md border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {deleteBook.isPending ? "Deleting..." : "Delete book"}
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
