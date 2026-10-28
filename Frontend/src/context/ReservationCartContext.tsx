import { useEffect, useState, type ReactNode } from "react";
import type { Book } from "../types";
import { ReservationCartContext, type ReservationCartItem } from "./ReservationCart";

const STORAGE_KEY = "reservationCart";

function readCart(): ReservationCartItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ReservationCartItem =>
        typeof item === "object" &&
        item !== null &&
        "book" in item &&
        typeof item.book === "object" &&
        item.book !== null &&
        "isbn" in item.book &&
        typeof item.book.isbn === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function ReservationCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReservationCartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addBook = (book: Book) => {
    const currentQuantity = items.find((item) => item.book.isbn === book.isbn)?.quantity ?? 0;
    if (currentQuantity >= book.stock) return false;

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.book.isbn === book.isbn);
      if (existing) {
        return currentItems.map((item) =>
          item.book.isbn === book.isbn
            ? { book, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...currentItems, { book, quantity: 1 }];
    });
    return true;
  };

  const setQuantity = (isbn: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.book.isbn === isbn
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.book.stock)) }
          : item,
      ),
    );
  };

  const removeBook = (isbn: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.book.isbn !== isbn));
  };

  const clearCart = () => setItems([]);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <ReservationCartContext.Provider
      value={{ items, itemCount, total, addBook, setQuantity, removeBook, clearCart }}
    >
      {children}
    </ReservationCartContext.Provider>
  );
}
