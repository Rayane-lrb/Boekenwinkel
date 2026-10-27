import { createContext, useContext, useState, type ReactNode } from "react";
import { clearToken, getToken, setToken } from "../api/client";
import { signIn } from "../api/auth";
import type { LoginRequest } from "../types";

interface AuthContextValue {
  isLoggedIn: boolean;
  login: (input: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());

  const login = async (input: LoginRequest) => {
    const { token } = await signIn(input);
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