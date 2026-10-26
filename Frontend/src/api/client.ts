const BASE_URL = import.meta.env.BASE_URL;

export async function api<T>(
  path: string,
  options: {
    method?: string; 
    body?: unknown;
    params?: Record<string,string>;
    signal?: AbortSignal} = {}
): Promise<T> {

  const query = options.params ? "?" + new URLSearchParams(options.params) : "";

  const res = await fetch(BASE_URL + path + query, {
    method: options.method,
    signal: options.signal,
    headers: options.body ? {"Content-Type" : "application/json"} : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();

  if(!res.ok) {
    let message = res.statusText;
    try {
      message = JSON.parse(text).message ?? message;
    }
    catch {}
      throw new Error(message);
    }

  try {
    return JSON.parse(text);
  }
  catch {
    return text as T;
  }
}