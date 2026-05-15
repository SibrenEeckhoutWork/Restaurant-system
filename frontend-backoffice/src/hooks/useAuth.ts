'use client';

import { useState, useEffect, useCallback } from 'react';
import { tokenService } from '@/lib/auth/tokenService';
import { authFetch } from '@/lib/auth/authFetch';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface AuthUser {
  id: string;
  email: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenService.get();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authFetch('/auth/me')
      .then((res) => (res.ok ? (res.json() as Promise<AuthUser>) : null))
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, tenantSlug }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const { accessToken } = (await res.json()) as { accessToken: string };
    tokenService.set(accessToken);

    const me = await authFetch('/auth/me');
    const u = (await me.json()) as AuthUser;
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authFetch('/auth/logout', { method: 'POST' }).catch(() => null);
    tokenService.remove();
    setUser(null);
  }, []);

  return { user, isLoading, login, logout };
}
