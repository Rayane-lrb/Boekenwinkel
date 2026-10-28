import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateReservation, useReservations } from "../../hooks/useReservations";
import { useReservationCart } from "../../hooks/useReservationCart";
import { useAuth } from "../../hooks/useAuth";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const reservationsQuery = useReservations();
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const createReservation = useCreateReservation();
  const { items, itemCount, total, setQuantity, removeBook, clearCart } = useReservationCart();
  const [search, setSearch] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCreateReservation = async () => {
    setCheckoutError(null);
    try {
      const reservation = await createReservation.mutateAsync({
        items: items.map(({ book, quantity }) => ({ isbn: book.isbn, quantity })),
      });
      clearCart();
      navigate(`/reservations/${encodeURIComponent(reservation.id)}`);
    } catch (error) {
      setCheckoutError(errorMessage(error));
    }
  };

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

      <section className="space-y-4 rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-blue-950">Reservation list</h2>
          <p className="mt-1 text-sm text-slate-600">
            {itemCount} {itemCount === 1 ? "book" : "books"} selected
          </p>
        </div>
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-6 text-center text-slate-600">
            Your reservation list is empty. <Link to="/books" className="font-medium text-[#9A7626] hover:underline">Browse books</Link> to add some.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {items.map(({ book, quantity }) => (
                <li key={book.isbn} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <Link to={`/books/${encodeURIComponent(book.isbn)}`} className="font-semibold text-blue-950 hover:underline">
                      {book.title}
                    </Link>
                    <p className="text-sm text-slate-600">{book.authorFirstName} {book.authorLastName}</p>
                    <p className="text-xs text-slate-500">€{book.price.toFixed(2)} each · {book.stock} in stock</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <span>Quantity</span>
                    <input
                      aria-label={`Quantity for ${book.title}`}
                      type="number"
                      min={1}
                      max={book.stock}
                      value={quantity}
                      onChange={(event) => {
                        const nextQuantity = Number(event.target.value);
                        if (Number.isInteger(nextQuantity) && nextQuantity >= 1) {
                          setQuantity(book.isbn, nextQuantity);
                        }
                      }}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1"
                    />
                  </label>
                  <span className="w-24 text-right font-semibold text-blue-950">
                    €{(book.price * quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBook(book.isbn)}
                    className="text-sm font-medium text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <p className="text-lg font-bold text-blue-950">Total: €{total.toFixed(2)}</p>
              <button
                type="button"
                onClick={handleCreateReservation}
                disabled={createReservation.isPending || items.length === 0}
                className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createReservation.isPending ? "Creating reservation..." : "Create reservation"}
              </button>
            </div>
          </>
        )}
        {checkoutError && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Could not create reservation: {checkoutError}
          </p>
        )}
      </section>

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
                    {isAdmin && (
                      <p className="mt-1 text-sm text-slate-600">
                        Reserved by: <span className="font-medium text-blue-950">
                          {reservation.userFirstName} {reservation.userLastName}
                        </span>
                      </p>
                    )}
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
