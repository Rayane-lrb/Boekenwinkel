import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteBook, useBook } from "../../hooks/useBooks";
import { useCreateReview, useReviews } from "../../hooks/useReviews";
import { useAuth } from "../../hooks/useAuth";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function BookDetailsPage() {
  const { isbn = "" } = useParams();
  const navigate = useNavigate();
  const bookQuery = useBook(isbn);
  const reviewsQuery = useReviews();
  const createReview = useCreateReview();
  const { isLoggedIn, hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const deleteBook = useDeleteBook();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ score: 5, text: "" });

  const bookReviews = (reviewsQuery.data ?? []).filter((review) => review.isbn === isbn);
  const averageRating =
    bookReviews.length > 0
      ? (bookReviews.reduce((total, review) => total + review.score, 0) / bookReviews.length).toFixed(1)
      : "0.0";

  const handleDelete = () => {
    const book = bookQuery.data;
    if (!book || !window.confirm(`Delete "${book.title}"? This action cannot be undone.`)) return;

    setDeleteError(null);
    deleteBook.mutate(book.isbn, {
      onSuccess: () => navigate("/books"),
      onError: (error) => setDeleteError(errorMessage(error)),
    });
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setReviewError("Please log in before leaving a review.");
      return;
    }

    setReviewError(null);
    setReviewSuccess(null);

    try {
      await createReview.mutateAsync({
        isbn,
        score: reviewForm.score,
        text: reviewForm.text.trim(),
      });
      setReviewSuccess("Your review has been submitted.");
      setReviewForm({ score: 5, text: "" });
    } catch (error) {
      setReviewError(errorMessage(error));
    }
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

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-blue-950">Reviews for this book</h3>
              <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-[#9A7626]">
                {bookReviews.length} review{bookReviews.length === 1 ? "" : "s"}
              </span>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold text-blue-950">Leave a review</h4>
                {!isLoggedIn && (
                  <Link to="/login" className="text-sm font-medium text-[#9A7626] hover:underline">
                    Log in to review
                  </Link>
                )}
              </div>

              <label className="block space-y-1 text-sm font-medium">
                <span>Rating</span>
                <select
                  value={reviewForm.score}
                  onChange={(event) => setReviewForm({ ...reviewForm, score: Number(event.target.value) })}
                  disabled={!isLoggedIn || createReview.isPending}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {[5, 4, 3, 2, 1].map((score) => (
                    <option key={score} value={score}>
                      {score} / 5
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 text-sm font-medium">
                <span>Your review</span>
                <textarea
                  rows={4}
                  value={reviewForm.text}
                  onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })}
                  placeholder="Share your thoughts about this book..."
                  disabled={!isLoggedIn || createReview.isPending}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </label>

              {reviewError && (
                <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {reviewError}
                </p>
              )}
              {reviewSuccess && (
                <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                  {reviewSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={!isLoggedIn || createReview.isPending}
                className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createReview.isPending ? "Submitting..." : "Submit review"}
              </button>
            </form>

            {reviewsQuery.isLoading && <p className="text-sm text-slate-600">Loading reviews...</p>}
            {reviewsQuery.isError && (
              <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                Could not load reviews for this book.
              </p>
            )}

            {!reviewsQuery.isLoading && !reviewsQuery.isError && bookReviews.length === 0 && (
              <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-4 text-sm text-slate-600">
                No reviews have been submitted for this book yet.
              </p>
            )}

            {bookReviews.length > 0 && (
              <div className="space-y-3">
                <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-[#9A7626]">
                  Average rating: <span className="font-semibold">{averageRating} / 5</span>
                </div>
                <ul className="space-y-3">
                  {bookReviews.map((review) => (
                    <li key={review.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-blue-950">{review.email}</span>
                        <span className="rounded-full border border-amber-300 bg-white px-2 py-1 text-xs font-medium text-[#9A7626]">
                          {review.score}/5
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {review.text || "No review text provided."}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {isAdmin && (
            <>
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
            </>
          )}
        </article>
      )}
    </section>
  );
}
