import { useState, type ReactNode } from "react";
import { clearToken, getToken, setToken } from "../api/client";
import { signIn } from "../api/auth";
import type { LoginRequest } from "../types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({children}: {children: ReactNode}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());

  const login = async (input: LoginRequest) => {
    const token = await signIn(input);
    if (!token.trim()) throw new Error("The server did not return an authentication token.");
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearToken();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}