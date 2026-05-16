'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface Allergy { id: string; name: string; icon: string | null }
export interface AccessoryProduct { id: string; name: string; price: number }
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  allergies: Allergy[];
  accessories: AccessoryProduct[];
}
export interface MenuCategory { id: string; name: string; sortOrder: number; products: MenuItem[] }

export function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`;
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function useMenuData() {
  const { slug } = useTenant();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/menu?tenantSlug=${slug}`)
      .then((r) => r.ok ? r.json() as Promise<MenuCategory[]> : [])
      .then((data) => setCategories(data.filter((c) => !c.name.toLowerCase().includes('ontbijtbox'))))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return { categories, loading, slug };
}
