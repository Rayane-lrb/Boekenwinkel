import { useState } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../../hooks/useReviews";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReviewsPage() {
  const reviewsQuery = useReviews();
  const [search, setSearch] = useState("");

  const reviews = reviewsQuery.data ?? [];
  const filteredReviews = reviews.filter((review) => {
    const text = `${review.email} ${review.isbn} ${review.text}`;
    return text.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Reader feedback</p>
        <h1 className="text-3xl font-bold text-blue-950">Reviews</h1>
        <p className="text-sm text-slate-600">Browse customer reviews left for the book collection.</p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All reviews</h2>
            <p className="mt-1 text-sm text-slate-600">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"} received
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search reviews</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email or ISBN..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {reviewsQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading reviews...</p>}
        {reviewsQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load reviews: {errorMessage(reviewsQuery.error)}
          </p>
        )}
        {reviewsQuery.isSuccess && filteredReviews.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No reviews match your search." : "There are no reviews yet."}
          </p>
        )}

        {filteredReviews.length > 0 && (
          <ul className="space-y-4">
            {filteredReviews.map((review) => (
              <li key={review.id} className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9A7626]">
                      {review.email}
                    </p>
                    <h3 className="text-lg font-semibold text-blue-950">Rating: {review.score}/5</h3>
                    <p className="text-sm text-slate-500">ISBN: {review.isbn}</p>
                    <p className="text-sm text-slate-600">{review.text || "No review text provided."}</p>
                  </div>
                  <Link
                    to={`/reviews/${encodeURIComponent(review.id)}`}
                    className="rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
                  >
                    View details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
