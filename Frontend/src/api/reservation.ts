import { api } from "./client";
import type { Reservation, ReservationRequest } from "../types";

export const getReservations = (signal: AbortSignal) =>
  api<Reservation[]>("/reservations", { signal });

export const getReservation = (id: string, signal: AbortSignal) =>
  api<Reservation>(`/reservations/${ encodeURIComponent(id) }`, { signal });

export const createReservation = (input: ReservationRequest) =>
  api<Reservation>("/reservations", { method: "POST", body: input });

export const deleteReservation = (id: string) =>
  api<{ message: string }>(`/reservations/${ encodeURIComponent(id) }`, { method: "DELETE" });
