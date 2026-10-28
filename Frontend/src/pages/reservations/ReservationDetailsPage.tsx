import { Link, useParams } from "react-router-dom";
import { useReservation, useUpdateReservationStatus } from "../../hooks/useReservations";
import { useBooks } from "../../hooks/useBooks";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import type { ReservationStatusUpdate } from "../../types";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReservationDetailsPage() {
  const { id = "" } = useParams();
  const reservationQuery = useReservation(id);
  const booksQuery = useBooks();
  const updateStatus = useUpdateReservationStatus();
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const [statusError, setStatusError] = useState<string | null>(null);
  const booksByIsbn = new Map((booksQuery.data ?? []).map((book) => [book.isbn, book]));

  const handleStatusUpdate = async (status: ReservationStatusUpdate) => {
    setStatusError(null);
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch (error) {
      setStatusError(errorMessage(error));
    }
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/reservations" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to reservations
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">Reservation details</h1>
      </header>

      {reservationQuery.isLoading && <p className="text-slate-600">Loading reservation...</p>}
      {reservationQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load reservation: {errorMessage(reservationQuery.error)}
        </p>
      )}

      {reservationQuery.data && (
        <article className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Order</p>
            <h2 className="text-2xl font-bold text-blue-950">Reservation #{reservationQuery.data.id.slice(0, 8)}</h2>
            <p className="text-sm text-slate-500">Status: {reservationQuery.data.status}</p>
            {isAdmin && (
              <p className="text-sm text-slate-600">
                Reserved by: <span className="font-semibold text-blue-950">
                  {reservationQuery.data.userFirstName} {reservationQuery.data.userLastName}
                </span>
              </p>
            )}
          </div>

          {isAdmin && reservationQuery.data.status === "PENDING" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                  className="rounded-md bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateStatus.isPending ? "Updating..." : "Confirm reservation"}
                </button>
                <button
                  type="button"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusUpdate("CANCELED")}
                  className="rounded-md border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel reservation
                </button>
              </div>
              {statusError && (
                <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  Could not update reservation status: {statusError}
                </p>
              )}
            </div>
          )}

          <dl className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Created</dt>
              <dd className="mt-1 font-semibold text-blue-950">
                {new Date(reservationQuery.data.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Confirmed</dt>
              <dd className="mt-1 font-semibold text-blue-950">
                {reservationQuery.data.confirmedAt ? new Date(reservationQuery.data.confirmedAt).toLocaleString() : "Not confirmed"}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="font-semibold text-blue-950">Items</h3>
            {reservationQuery.data.items.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No items in this reservation.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reservationQuery.data.items.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-blue-950">
                          {booksByIsbn.get(item.isbn)?.title ?? `ISBN: ${item.isbn}`}
                        </p>
                        {booksByIsbn.has(item.isbn) && (
                          <p className="text-xs text-slate-500">ISBN: {item.isbn}</p>
                        )}
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#9A7626]">
                        €{item.priceAtReservation.toFixed(2)} line total
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      )}
    </section>
  );
}
