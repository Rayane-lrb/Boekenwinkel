import { useState } from "react";
import { Link } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReservationsPage() {
  const reservationsQuery = useReservations();
  const [search, setSearch] = useState("");

  const reservations = reservationsQuery.data ?? [];
  const filteredReservations = reservations.filter((reservation) => {
    const text = `${reservation.status} ${reservation.id}`;
    return text.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Orders</p>
        <h1 className="text-3xl font-bold text-blue-950">Reservations</h1>
        <p className="text-sm text-slate-600">Track reservation requests and current order status.</p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All reservations</h2>
            <p className="mt-1 text-sm text-slate-600">
              {reservations.length} {reservations.length === 1 ? "reservation" : "reservations"}
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search reservations</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by status or ID..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {reservationsQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading reservations...</p>}
        {reservationsQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load reservations: {errorMessage(reservationsQuery.error)}
          </p>
        )}
        {reservationsQuery.isSuccess && filteredReservations.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No reservations match your search." : "There are no reservations yet."}
          </p>
        )}

        {filteredReservations.length > 0 && (
          <ul className="space-y-4">
            {filteredReservations.map((reservation) => (
              <li key={reservation.id} className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9A7626]">
                      {reservation.status}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-blue-950">Reservation #{reservation.id.slice(0, 8)}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Created: {new Date(reservation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                      {reservation.items.length} item{reservation.items.length === 1 ? "" : "s"}
                    </span>
                    <Link
                      to={`/reservations/${encodeURIComponent(reservation.id)}`}
                      className="rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
