import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  deleteReservation,
  getReservation,
  getReservations,
} from "../api/reservation";
import type { ReservationRequest } from "../types";

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
