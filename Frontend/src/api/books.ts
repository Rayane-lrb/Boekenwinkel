import { api } from "./client";
import type { Book, BookRequest } from "../types";

export const getBooks = (signal?: AbortSignal) =>
  api<Book[]>("/books", { signal });

export const getBook = (isbn: string, signal?: AbortSignal) =>
  api<Book>(`/books/${encodeURIComponent(isbn)}`, { signal });

export const createBook = (input: BookRequest) =>
  api<Book>("/books", { method: "POST", body: input });

export const updateBook = (input: BookRequest) =>
  api<Book>(`/books/${ encodeURIComponent(input.isbn)}`, { method: "PUT", body: input });

export const deleteBook = (isbn: string) =>
  api<Book>(`/books/${ encodeURIComponent(isbn) }`, {method: "DELETE", params: { isbn }});
