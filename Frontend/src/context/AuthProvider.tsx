import { useEffect, useState, type ReactNode } from "react";
import { ApiError, clearToken, getToken, setToken } from "../api/client";
import { getCurrentUser, signIn } from "../api/auth";
import type { LoginRequest } from "../types";
import { AuthContext } from "./AuthContext";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to verify your account.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) return;

    let active = true;
    getCurrentUser()
      .then((user) => {
        if (active) setRoles(user.roles);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          clearToken();
          setIsLoggedIn(false);
          setRoles([]);
          return;
        }
        setAuthError(errorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (input: LoginRequest) => {
    const token = await signIn(input);
    if (!token.trim()) throw new Error("The server did not return an authentication token.");
    setToken(token);
    setRoles([]);
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await getCurrentUser();
      setRoles(user.roles);
      setIsLoggedIn(true);
    } catch (error) {
      clearToken();
      setRoles([]);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setIsLoggedIn(false);
    setRoles([]);
    setAuthError(null);
  };

  const hasRole = (role: string) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, authError, hasRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}