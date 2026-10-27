import { useState } from "react";
import { Link } from "react-router-dom";
import { useReservationItems } from "../../hooks/useReservationItems";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReservationItemsPage() {
  const reservationItemsQuery = useReservationItems();
  const [search, setSearch] = useState("");

  const items = reservationItemsQuery.data ?? [];
  const filteredItems = items.filter((item) => {
    const text = `${item.isbn} ${item.id}`;
    return text.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Order lines</p>
        <h1 className="text-3xl font-bold text-blue-950">Reservation items</h1>
        <p className="text-sm text-slate-600">Review the individual products inside each reservation.</p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All items</h2>
            <p className="mt-1 text-sm text-slate-600">
              {items.length} {items.length === 1 ? "item" : "items"} in reservations
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search items</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ISBN or ID..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {reservationItemsQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading items...</p>}
        {reservationItemsQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load reservation items: {errorMessage(reservationItemsQuery.error)}
          </p>
        )}
        {reservationItemsQuery.isSuccess && filteredItems.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No items match your search." : "There are no reservation items yet."}
          </p>
        )}

        {filteredItems.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <li key={item.id} className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9A7626]">ISBN {item.isbn}</p>
                  <h3 className="text-lg font-semibold text-blue-950">{item.quantity} unit{item.quantity === 1 ? "" : "s"}</h3>
                  <p className="text-sm text-slate-600">Price at reservation: €{item.priceAtReservation.toFixed(2)}</p>
                  <Link
                    to={`/reservation-items/${encodeURIComponent(item.id)}`}
                    className="mt-2 block rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
                  >
                    View item
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
