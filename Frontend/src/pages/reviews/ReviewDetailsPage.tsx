import { Link, useParams } from "react-router-dom";
import { useReview } from "../../hooks/useReviews";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReviewDetailsPage() {
  const { id = "" } = useParams();
  const reviewQuery = useReview(id);

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/reviews" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to reviews
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Review details</h1>
      </header>

      {reviewQuery.isLoading && <p className="text-slate-600">Loading review...</p>}
      {reviewQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load review: {errorMessage(reviewQuery.error)}
        </p>
      )}

      {reviewQuery.data && (
        <article className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Review</p>
            <h2 className="text-2xl font-bold text-blue-950">{reviewQuery.data.score}/5 rating</h2>
            <p className="text-sm text-slate-500">ID: {reviewQuery.data.id}</p>
          </div>

          <dl className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Reader</dt>
              <dd className="mt-1 font-semibold text-blue-950">{reviewQuery.data.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Book ISBN</dt>
              <dd className="mt-1 font-semibold text-blue-950">{reviewQuery.data.isbn}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Created</dt>
              <dd className="mt-1 font-semibold text-blue-950">
                {new Date(reviewQuery.data.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Score</dt>
              <dd className="mt-1 font-semibold text-blue-950">{reviewQuery.data.score} / 5</dd>
            </div>
          </dl>

          <div>
            <h3 className="font-semibold text-blue-950">Review text</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {reviewQuery.data.text || "No review text provided."}
            </p>
          </div>
        </article>
      )}
    </section>
  );
}
