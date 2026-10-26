import { api } from "./client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types";

export const signIn = (input: LoginRequest) =>
  api<LoginResponse>("/auth/signin", { method: "POST", body: input});

export const signUp = (input: RegisterRequest) =>
  api<{message: string }>("/auth/signup", { method: "POST", body: input});