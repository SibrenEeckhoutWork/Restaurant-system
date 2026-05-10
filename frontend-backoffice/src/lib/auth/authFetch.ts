import { tokenService } from './tokenService';

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = tokenService.get();

  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API}${input}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (res.status !== 401) return res;

  const refreshRes = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshRes.ok) {
    tokenService.remove();
    window.location.href = '/login';
    return res;
  }

  const { accessToken } = (await refreshRes.json()) as { accessToken: string };
  tokenService.set(accessToken);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(`${API}${input}`, { ...init, headers, credentials: 'include' });
}
