import { adminFetch } from '@/lib/auth/adminFetch';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleConfig {
  id: string;
  permission: string;
  required: boolean;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }
  let message = res.statusText;
  try {
    const body = (await res.json()) as { message?: string };
    if (body.message) message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
  } catch {}
  throw new Error(message);
}

export const tenantsAdminService = {
  getAll(): Promise<Tenant[]> {
    return adminFetch('/tenants').then((r) => handleResponse<Tenant[]>(r));
  },

  getById(id: string): Promise<Tenant> {
    return adminFetch(`/tenants/${id}`).then((r) => handleResponse<Tenant>(r));
  },

  count(): Promise<number> {
    return adminFetch('/tenants/count').then((r) => handleResponse<number>(r));
  },

  create(data: { name: string; slug: string; adminEmail?: string; adminPassword?: string }): Promise<{ tenant: Tenant; adminUser: unknown | null }> {
    return adminFetch('/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ tenant: Tenant; adminUser: unknown | null }>(r));
  },

  update(id: string, data: Partial<{ name: string; slug: string; isActive: boolean }>): Promise<Tenant> {
    return adminFetch(`/tenants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<Tenant>(r));
  },

  remove(id: string): Promise<void> {
    return adminFetch(`/tenants/${id}`, { method: 'DELETE' }).then((r) => handleResponse<void>(r));
  },

  getModules(id: string): Promise<ModuleConfig[]> {
    return adminFetch(`/tenants/${id}/modules`).then((r) => handleResponse<ModuleConfig[]>(r));
  },

  setModule(id: string, permission: string, required: boolean): Promise<ModuleConfig> {
    return adminFetch(`/tenants/${id}/modules/${permission}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ required }),
    }).then((r) => handleResponse<ModuleConfig>(r));
  },
};
