const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "authToken";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(
  path: string,
  options: {
    method?: string; 
    body?: unknown;
    params?: Record<string,string>;
    signal?: AbortSignal} = {}
): Promise<T> {

  const query = options.params ? "?" + new URLSearchParams(options.params) : "";
  const token = getToken();

  const url = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}${query}`;
  const res = await fetch(url, {
    method: options.method,
    signal: options.signal,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();

  if(!res.ok) {
    let message = res.statusText;
    try {
      message = JSON.parse(text).message ?? message;
    }
    catch {
      message = res.statusText;
    }
      throw new ApiError(message, res.status);
    }

  try {
    return JSON.parse(text);
  }
  catch {
    return text as T;
  }
}