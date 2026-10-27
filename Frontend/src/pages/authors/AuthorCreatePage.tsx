import { Link, useNavigate } from "react-router-dom";
import AuthorForm from "../../components/authors/AuthorForm";
import type { Author } from "../../types";

export default function AuthorCreatePage() {
  const navigate = useNavigate();

  const handleSaved = (author: Author) => {
    navigate(`/authors/${encodeURIComponent(author.id)}`);
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/authors" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to authors
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Create an author</h1>
        <p className="text-sm text-slate-600">Enter the author’s name.</p>
      </header>
      <AuthorForm onSaved={handleSaved} />
    </section>
  );
}
