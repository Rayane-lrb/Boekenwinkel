import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthors } from "../../hooks/useAuthors";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function AuthorsPage() {
  const authorsQuery = useAuthors();
  const [search, setSearch] = useState("");

  const authors = authorsQuery.data ?? [];
  const filteredAuthors = authors.filter((author) =>
    `${author.firstName} ${author.lastName}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Library collection</p>
          <h1 className="text-3xl font-bold text-blue-950">Authors</h1>
          <p className="max-w-2xl text-sm text-slate-600">Browse and manage the authors in your library.</p>
        </div>
        <Link
          to="/authors/new"
          className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400"
        >
          Add an author
        </Link>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All authors</h2>
            <p className="mt-1 text-sm text-slate-600">
              {authors.length} {authors.length === 1 ? "author" : "authors"} in the collection
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search authors</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {authorsQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading authors...</p>}
        {authorsQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load authors: {errorMessage(authorsQuery.error)}
          </p>
        )}
        {authorsQuery.isSuccess && filteredAuthors.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No authors match your search." : "There are no authors in the collection yet."}
          </p>
        )}
        {filteredAuthors.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAuthors.map((author) => (
              <li key={author.id} className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-950">
                  {author.firstName} {author.lastName}
                </h3>
                <Link
                  to={`/authors/${encodeURIComponent(author.id)}`}
                  className="mt-4 block rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
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
