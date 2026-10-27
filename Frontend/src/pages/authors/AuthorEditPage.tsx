import { Link, useNavigate, useParams } from "react-router-dom";
import AuthorForm from "../../components/authors/AuthorForm";
import { useAuthor } from "../../hooks/useAuthors";
import type { Author } from "../../types";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function AuthorEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const authorQuery = useAuthor(id);

  const handleSaved = (author: Author) => {
    navigate(`/authors/${encodeURIComponent(author.id)}`);
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to={`/authors/${encodeURIComponent(id)}`} className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to author details
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Edit author</h1>
      </header>
      {authorQuery.isLoading && <p className="text-slate-600">Loading author...</p>}
      {authorQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load author: {errorMessage(authorQuery.error)}
        </p>
      )}
      {authorQuery.data && (
        <AuthorForm key={authorQuery.data.id} author={authorQuery.data} onSaved={handleSaved} />
      )}
    </section>
  );
}
