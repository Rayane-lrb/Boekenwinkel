import { useState, type FormEvent } from "react";
import { useAuthors } from "../../hooks/useAuthors";
import { useCreateBook, useUpdateBook } from "../../hooks/useBooks";
import type { Book, BookRequest } from "../../types";

interface BookFormProps {
  book?: Book;
  onSaved: (book: Book) => void;
}

const emptyBook: BookRequest = {
  isbn: "",
  title: "",
  description: "",
  price: 0,
  stock: 0,
  authorId: "",
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function BookForm({ book, onSaved }: BookFormProps) {
  const authorsQuery = useAuthors();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const [form, setForm] = useState<BookRequest>(() =>
    book
      ? {
          ...emptyBook,
          isbn: book.isbn,
          title: book.title,
          description: book.description ?? "",
          price: book.price,
          stock: book.stock,
        }
      : emptyBook,
  );

  const isEditing = Boolean(book);
  const isSaving = createBook.isPending || updateBook.isPending;
  const bookAuthor = authorsQuery.data?.find(
    (author) => author.firstName === book?.authorFirstName && author.lastName === book?.authorLastName,
  );
  const selectedAuthorId = form.authorId || bookAuthor?.id || "";
  const authorNotFound =
    isEditing &&
    authorsQuery.isSuccess &&
    !bookAuthor &&
    !form.authorId;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      ...form,
      authorId: selectedAuthorId,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (book) {
      updateBook.mutate(input, { onSuccess: onSaved });
    } else {
      createBook.mutate(input, { onSuccess: onSaved });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm sm:grid-cols-2">
      <label className="space-y-1 text-sm font-medium">
        <span>Title</span>
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
        />
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>ISBN</span>
        <input
          required
          disabled={isEditing}
          value={form.isbn}
          onChange={(event) => setForm({ ...form, isbn: event.target.value })}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200 disabled:bg-slate-100"
        />
      </label>
      <label className="space-y-1 text-sm font-medium">
        <span>Author</span>
        <select
          required
          value={selectedAuthorId}
          onChange={(event) => setForm({ ...form, authorId: event.target.value })}
          disabled={authorsQuery.isLoading || !authorsQuery.data?.length}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200 disabled:bg-slate-100"
        >
          <option value="">{authorsQuery.isLoading ? "Loading authors..." : "Select an author"}</option>
          {authorsQuery.data?.map((author) => (
            <option key={author.id} value={author.id}>
              {author.firstName} {author.lastName}
            </option>
          ))}
        </select>
        {!authorsQuery.isLoading && authorsQuery.data?.length === 0 && (
          <span className="block text-xs font-normal text-slate-600">Add an author before creating a book.</span>
        )}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-sm font-medium">
          <span>Price (€)</span>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          <span>Stock</span>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium sm:col-span-2">
        <span>Description</span>
        <textarea
          rows={4}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
        />
      </label>

      {authorsQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          Could not load authors: {errorMessage(authorsQuery.error)}
        </p>
      )}
      {authorNotFound && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          The current author is no longer available. Select another author before saving.
        </p>
      )}
      {(createBook.isError || updateBook.isError) && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
          Could not save the book: {errorMessage(createBook.error ?? updateBook.error)}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={
            isSaving ||
            authorsQuery.isError ||
            !authorsQuery.data?.length ||
            authorNotFound ||
            !selectedAuthorId
          }
          className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create book"}
        </button>
      </div>
    </form>
  );
}
