import { api } from "./client";
import type { reservationItem, reservationItemRequest } from "../types";

export const getReservationItems = (signal: AbortSignal) =>
  api<reservationItem>("/reservation_items", { signal });

export const getReservationItem = (id: string, signal: AbortSignal) =>
  api<reservationItem>(`/reservation_items/${ encodeURIComponent(id) }`, { signal });

export const createReservationItem = (input: reservationItemRequest) =>
  api<reservationItem>("/reservation_item", { method: "POST", body: input });

export const updateReservationItem = (id: string, input: reservationItemRequest) =>
  api<reservationItemRequest>(`/reservation_items/${ encodeURIComponent(id)}`, { method: "PUT", body: input});

export const deleteReservationItem = (id: string) =>
  api<{ message: string }>(`reservation_items/${ encodeURIComponent(id) }`, { method: "DELETE" });