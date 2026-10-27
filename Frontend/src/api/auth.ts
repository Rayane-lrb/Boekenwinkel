import { api } from "./client";
import type { LoginRequest, RegisterRequest } from "../types";

export const signIn = (input: LoginRequest) =>
  api<string>("/auth/signin", {
    method: "POST",
    body: { email: input.email, passwordHash: input.password },
  });

export const signUp = (input: RegisterRequest) =>
  api<string>("/auth/signup", {
    method: "POST",
    body: {
      email: input.email,
      passwordHash: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });