import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  deleteReservation,
  getReservation,
  getReservations,
  updateReservationStatus,
} from "../api/reservation";
import type { ReservationRequest, ReservationStatusUpdate } from "../types";

export const useReservations = () =>
  useQuery({
    queryKey: ["reservations"],
    queryFn: ({ signal }) => getReservations(signal),
  });

export const useReservation = (id: string) =>
  useQuery({
    queryKey: ["reservations", id],
    queryFn: ({ signal }) => getReservation(id, signal),
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReservationRequest) => createReservation(input),
    onSuccess: (reservation) => {
      queryClient.setQueryData(["reservations", reservation.id], reservation);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatusUpdate }) =>
      updateReservationStatus(id, status),
    onSuccess: (reservation) => {
      queryClient.setQueryData(["reservations", reservation.id], reservation);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      if (reservation.status === "CONFIRMED") {
        queryClient.invalidateQueries({ queryKey: ["books"] });
      }
    },
  });
};

export const useDeleteReservation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteReservation(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["reservations", id] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};
