import { useState } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../../hooks/useBooks";
import { useAuth } from "../../hooks/useAuth";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function BooksPage() {
  const booksQuery = useBooks();
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const [search, setSearch] = useState("");

  const books = booksQuery.data ?? [];
  const filteredBooks = books.filter((book) => {
    const searchText = `${book.title} ${book.authorFirstName} ${book.authorLastName} ${book.isbn}`;
    return searchText.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Library collection</p>
          <h1 className="text-3xl font-bold text-blue-950">Books</h1>
          <p className="max-w-2xl text-sm text-slate-600">Browse and search the books in your library.</p>
        </div>
        {isAdmin && (
          <Link
            to="/books/new"
            className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400"
          >
            Add a book
          </Link>
        )}
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All books</h2>
            <p className="mt-1 text-sm text-slate-600">
              {books.length} {books.length === 1 ? "book" : "books"} in the collection
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search by title, author, or ISBN</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {booksQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading books...</p>}
        {booksQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load books: {errorMessage(booksQuery.error)}
          </p>
        )}
        {booksQuery.isSuccess && filteredBooks.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No books match your search." : "There are no books in the collection yet."}
          </p>
        )}

        {filteredBooks.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <li key={book.isbn} className="flex flex-col rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold leading-snug text-blue-950">{book.title}</h3>
                  <p className="text-sm font-medium text-[#9A7626]">
                    {book.authorFirstName} {book.authorLastName}
                  </p>
                  <p className="text-xs text-slate-500">ISBN: {book.isbn}</p>
                  {book.description && (
                    <p className="line-clamp-3 text-sm text-slate-600">{book.description}</p>
                  )}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="font-semibold text-blue-950">€{book.price.toFixed(2)}</span>
                    <span className="text-slate-600">{book.stock} in stock</span>
                  </div>
                </div>
                <Link
                  to={`/books/${encodeURIComponent(book.isbn)}`}
                  className="mt-4 rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
                >
                  View details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
