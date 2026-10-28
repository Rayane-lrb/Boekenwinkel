import { createContext } from "react";
import type { Book } from "../types";

export interface ReservationCartItem {
  book: Book;
  quantity: number;
}

export interface ReservationCartContextValue {
  items: ReservationCartItem[];
  itemCount: number;
  total: number;
  addBook: (book: Book) => boolean;
  setQuantity: (isbn: string, quantity: number) => void;
  removeBook: (isbn: string) => void;
  clearCart: () => void;
}

export const ReservationCartContext = createContext<ReservationCartContextValue | null>(null);
