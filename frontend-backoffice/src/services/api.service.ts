import { authFetch } from '@/lib/auth/authFetch';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T;
    return res.json() as Promise<T>;
  }
  let message = res.statusText;
  try {
    const body = (await res.json()) as { message?: string };
    if (body.message) message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
  } catch {}
  throw new ApiError(res.status, message);
}

export const apiService = {
  get<T>(path: string): Promise<T> {
    return authFetch(path).then((r) => handleResponse<T>(r));
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return authFetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handleResponse<T>(r));
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return authFetch(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handleResponse<T>(r));
  },
  delete<T>(path: string): Promise<T> {
    return authFetch(path, { method: 'DELETE' }).then((r) => handleResponse<T>(r));
  },
  deleteWithBody<T>(path: string, body: unknown): Promise<T> {
    return authFetch(path, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => handleResponse<T>(r));
  },
};
