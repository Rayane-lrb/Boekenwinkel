import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthor, useDeleteAuthor } from "../../hooks/useAuthors";
import { useAuth } from "../../hooks/useAuth";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function AuthorDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const authorQuery = useAuthor(id);
  const deleteAuthor = useDeleteAuthor(id);
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = () => {
    const author = authorQuery.data;
    if (!author || !window.confirm(`Delete ${author.firstName} ${author.lastName}? This action cannot be undone.`)) {
      return;
    }

    setDeleteError(null);
    deleteAuthor.mutate(undefined, {
      onSuccess: () => navigate("/authors"),
      onError: (error) => setDeleteError(errorMessage(error)),
    });
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/authors" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to authors
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Author details</h1>
      </header>
      {authorQuery.isLoading && <p className="text-slate-600">Loading author...</p>}
      {authorQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load author: {errorMessage(authorQuery.error)}
        </p>
      )}
      {authorQuery.data && (
        <article className="space-y-5 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Author</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">
              {authorQuery.data.firstName} {authorQuery.data.lastName}
            </h2>
            <p className="mt-2 text-sm text-slate-500">ID: {authorQuery.data.id}</p>
          </div>
          {isAdmin && (
            <>
              {deleteError && (
                <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  Could not delete author: {deleteError}
                </p>
              )}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Link
                  to={`/authors/${encodeURIComponent(authorQuery.data.id)}/edit`}
                  className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400"
                >
                  Edit author
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteAuthor.isPending}
                  className="rounded-md border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {deleteAuthor.isPending ? "Deleting..." : "Delete author"}
                </button>
              </div>
            </>
          )}
        </article>
      )}
    </section>
  );
}
