import { api } from "./client";
import {type Review, type ReviewRequest } from "../types";

export const getReviews = (signal: AbortSignal) =>
  api<Review[]>("/reviews", { signal });

export const getReview = (id: string, signal: AbortSignal) =>
  api<Review>(`/reviews/${ encodeURIComponent(id) }`, { signal });

export const createReview = (input: ReviewRequest) =>
  api<Review>("/reviews", { method: "POST", body: input });

export const deleteReview = (id: string) => 
  api<{ message: string }>(`/reviews/${ encodeURIComponent(id) }`, { method: "DELETE" });