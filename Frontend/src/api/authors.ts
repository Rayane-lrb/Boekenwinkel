import { api } from "./client";
import type { Author, AuthorRequest } from "../types"

export const getAuthors = (signal: AbortSignal) =>
  api<Author[]>("/authors", { signal });

export const getAuthor = (id: string, signal: AbortSignal) =>
  api<Author>(`/authors/${encodeURIComponent(id)}`, { signal });

export const createAuthor = (input: AuthorRequest) =>
api<Author>("/authors", {method: "POST", body: input });

export const updateAuthor = (id: string, input: AuthorRequest) =>
  api<Author>(`/authors/${ encodeURIComponent(id) }`, { method: "PUT", body: input });

export const deleteAuthor = (id: string) =>
  api<string>(`/authors/${ encodeURIComponent(id) }`, { method: "DELETE" });