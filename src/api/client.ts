const baseURL =
  import.meta.env.VITE_API_URL ?? 'https://localhost:7170/api';

export const TOKEN_KEY = 'polifood.token';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseURL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const fallback = response.statusText || `HTTP ${response.status}`;
    const message =
      typeof data === 'string'
        ? data
        : (data as { message?: string; Message?: string } | null)?.message ??
          (data as { Message?: string } | null)?.Message ??
          fallback;
    throw new ApiError(response.status, data, message);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PUT', body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PATCH', body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: 'DELETE', signal }),
};
