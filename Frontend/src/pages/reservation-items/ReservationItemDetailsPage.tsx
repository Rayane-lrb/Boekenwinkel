import { Link, useParams } from "react-router-dom";
import { useReservationItem } from "../../hooks/useReservationItems";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReservationItemDetailsPage() {
  const { id = "" } = useParams();
  const itemQuery = useReservationItem(id);

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/reservation-items" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to reservation items
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Reservation item details</h1>
      </header>

      {itemQuery.isLoading && <p className="text-slate-600">Loading reservation item...</p>}
      {itemQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load reservation item: {errorMessage(itemQuery.error)}
        </p>
      )}

      {itemQuery.data && (
        <article className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Line item</p>
            <h2 className="text-2xl font-bold text-blue-950">ISBN: {itemQuery.data.isbn}</h2>
            <p className="text-sm text-slate-500">ID: {itemQuery.data.id}</p>
          </div>

          <dl className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Quantity</dt>
              <dd className="mt-1 font-semibold text-blue-950">{itemQuery.data.quantity}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Price at reservation</dt>
              <dd className="mt-1 font-semibold text-blue-950">€{itemQuery.data.priceAtReservation.toFixed(2)}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}
