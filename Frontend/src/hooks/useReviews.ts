import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
} from "../api/review";
import type { ReviewRequest } from "../types";

export const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: ({ signal }) => getReviews(signal),
  });

export const useReview = (id: string) =>
  useQuery({
    queryKey: ["reviews", id],
    queryFn: ({ signal }) => getReview(id, signal),
  });

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewRequest) => createReview(input),
    onSuccess: (review) => {
      queryClient.setQueryData(["reviews", review.id], review);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteReview(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
