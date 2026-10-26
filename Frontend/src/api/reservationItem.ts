import { api } from "./client";
import type { ReservationItem, ReservationItemRequest } from "../types";

export const getReservationItems = (signal: AbortSignal) =>
  api<ReservationItem>("/reservation_items", { signal });

export const getReservationItem = (id: string, signal: AbortSignal) =>
  api<ReservationItem>(`/reservation_items/${ encodeURIComponent(id) }`, { signal });

export const createReservationItem = (input: ReservationItemRequest) =>
  api<ReservationItem>("/reservation_item", { method: "POST", body: input });

export const updateReservationItem = (id: string, input: ReservationItemRequest) =>
  api<ReservationItemRequest>(`/reservation_items/${ encodeURIComponent(id)}`, { method: "PUT", body: input});

export const deleteReservationItem = (id: string) =>
  api<{ message: string }>(`reservation_items/${ encodeURIComponent(id) }`, { method: "DELETE" });