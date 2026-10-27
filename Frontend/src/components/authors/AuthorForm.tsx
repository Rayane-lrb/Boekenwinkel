import { useState, type FormEvent } from "react";
import { useCreateAuthor, useUpdateAuthor } from "../../hooks/useAuthors";
import type { Author, AuthorRequest } from "../../types";

interface AuthorFormProps {
  author?: Author;
  onSaved: (author: Author) => void;
}

const emptyAuthor: AuthorRequest = { firstName: "", lastName: "" };

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function AuthorForm({ author, onSaved }: AuthorFormProps) {
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor(author?.id ?? "");
  const [form, setForm] = useState<AuthorRequest>(() =>
    author ? { firstName: author.firstName, lastName: author.lastName } : emptyAuthor,
  );
  const isSaving = createAuthor.isPending || updateAuthor.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    };

    if (author) {
      updateAuthor.mutate(input, { onSuccess: onSaved });
    } else {
      createAuthor.mutate(input, { onSuccess: onSaved });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm sm:grid-cols-2"
    >
      <label className="space-y-1 text-sm font-medium">
        <span>First name</span>
        <input
          required
          autoComplete="given-name"
          value={form.firstName}
          onChange={(event) => setForm({ ...form, firstName: event.target.value })}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
        />
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>Last name</span>
        <input
          required
          autoComplete="family-name"
          value={form.lastName}
          onChange={(event) => setForm({ ...form, lastName: event.target.value })}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
        />
      </label>
      {(createAuthor.isError || updateAuthor.isError) && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          Could not save the author: {errorMessage(createAuthor.error ?? updateAuthor.error)}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving || !form.firstName.trim() || !form.lastName.trim()}
          className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : author ? "Save changes" : "Create author"}
        </button>
      </div>
    </form>
  );
}
