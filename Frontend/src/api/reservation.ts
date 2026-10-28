import { api } from "./client";
import type { Reservation, ReservationRequest, ReservationStatusUpdate } from "../types";

export const getReservations = (signal: AbortSignal) =>
  api<Reservation[]>("/reservations", { signal });

export const getReservation = (id: string, signal: AbortSignal) =>
  api<Reservation>(`/reservations/${ encodeURIComponent(id) }`, { signal });

export const createReservation = (input: ReservationRequest) =>
  api<Reservation>("/reservations", { method: "POST", body: input });

export const updateReservationStatus = (id: string, status: ReservationStatusUpdate) =>
  api<Reservation>(`/reservations/${encodeURIComponent(id)}/status`, {
    method: "PUT",
    body: { status },
  });

export const deleteReservation = (id: string) =>
  api<{ message: string }>(`/reservations/${ encodeURIComponent(id) }`, { method: "DELETE" });
