import { adminTokenService } from './adminTokenService';

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = adminTokenService.get();

  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API}${input}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (res.status !== 401) return res;

  const refreshRes = await fetch(`${API}/auth/super-admin/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshRes.ok) {
    adminTokenService.remove();
    window.location.href = '/admin/login';
    return res;
  }

  const { accessToken } = (await refreshRes.json()) as { accessToken: string };
  adminTokenService.set(accessToken);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(`${API}${input}`, { ...init, headers, credentials: 'include' });
}
