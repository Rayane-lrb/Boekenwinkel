import { createContext } from "react";
import type { LoginRequest } from "../types";

export interface AuthContextValue {
  isLoggedIn: boolean;
  login: (input: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
