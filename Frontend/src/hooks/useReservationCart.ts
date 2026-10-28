import { useContext } from "react";
import { ReservationCartContext } from "../context/ReservationCart";

export function useReservationCart() {
  const context = useContext(ReservationCartContext);
  if (!context) {
    throw new Error("useReservationCart must be used inside ReservationCartProvider");
  }
  return context;
}
