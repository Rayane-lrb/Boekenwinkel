import { api } from "./client";
import type { User, UserRegisterRequest, UserUpdateRequest } from "../types";

export const getUsers = (signal: AbortSignal) =>
  api<User[]>("/users", { signal });

export const getUser = (id: string, signal: AbortSignal) =>
  api<User>(`/users/${encodeURIComponent(id)}`, { signal });

export const createUser = (input: UserRegisterRequest) =>
  api<User>("/books", { method: "POST", body: input});

export const updateUser = (id: string, input: UserUpdateRequest) =>
  api<User>(`/users/${ encodeURIComponent(id) }`, { method: "PUT", body: input});

export const deleteUser = (id: string) =>
  api<void>(`/users/${ encodeURIComponent(id) }`, { method: "DELETE" });

export const promoteUser = (id: string) =>
  api<void>(`/users/${ encodeURIComponent(id)}/promote`, { method: "PUT" });

export const demoteUser = (id: string) =>
  api<void>(`/users/${ encodeURIComponent(id) }/demote`, { method: "PUT" });