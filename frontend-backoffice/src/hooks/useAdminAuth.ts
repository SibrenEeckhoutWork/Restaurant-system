'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminTokenService } from '@/lib/auth/adminTokenService';
import { adminFetch } from '@/lib/auth/adminFetch';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface AdminUser {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = adminTokenService.get();
    if (!token) {
      setIsLoading(false);
      return;
    }

    adminFetch('/auth/super-admin/me')
      .then((res) => (res.ok ? (res.json() as Promise<AdminUser>) : null))
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const { accessToken } = (await res.json()) as { accessToken: string };
    adminTokenService.set(accessToken);

    const me = await adminFetch('/auth/super-admin/me');
    const u = (await me.json()) as AdminUser;
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await adminFetch('/auth/super-admin/logout', { method: 'POST' }).catch(() => null);
    adminTokenService.remove();
    setUser(null);
  }, []);

  return { user, isLoading, login, logout };
}
