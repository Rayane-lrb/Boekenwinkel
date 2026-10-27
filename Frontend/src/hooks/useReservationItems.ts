import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReservationItems,
  getReservationItem,
  createReservationItem,
  updateReservationItem,
  deleteReservationItem,
} from "../api/reservationItem";
import type { ReservationItemRequest } from "../types";

export const useReservationItems = () =>
  useQuery({
    queryKey: ["reservationItems"],
    queryFn: ({ signal }) => getReservationItems(signal),
  });

export const useReservationItem = (id: string) =>
  useQuery({
    queryKey: ["reservationItems", id],
    queryFn: ({ signal }) => getReservationItem(id, signal),
  });

export const useCreateReservationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReservationItemRequest) => createReservationItem(input),
    onSuccess: (reservationItem) => {
      queryClient.setQueryData(["reservationItems", reservationItem.id], reservationItem);
      queryClient.invalidateQueries({ queryKey: ["reservationItems"] });
    },
  });
};

export const useUpdateReservationItem = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReservationItemRequest) => updateReservationItem(id, input),
    onSuccess: (reservationItem) => {
      queryClient.setQueryData(["reservationItems", id], reservationItem);
      queryClient.invalidateQueries({ queryKey: ["reservationItems"] });
    },
  });
};

export const useDeleteReservationItem = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteReservationItem(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["reservationItems", id] });
      queryClient.invalidateQueries({ queryKey: ["reservationItems"] });
    },
  });
};
