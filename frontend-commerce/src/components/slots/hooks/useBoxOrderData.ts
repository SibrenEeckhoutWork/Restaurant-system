'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface AccessoryProduct { id: string; name: string; price: number }
export interface BoxProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  accessories: AccessoryProduct[];
}
interface MenuCategory { id: string; name: string; sortOrder: number; products: BoxProduct[] }

export function useBoxOrderData() {
  const { slug } = useTenant();
  const [boxes, setBoxes] = useState<BoxProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/menu?tenantSlug=${slug}`)
      .then((r) => r.ok ? r.json() as Promise<MenuCategory[]> : [])
      .then((data) => {
        const cat = data.find((c) => c.name.toLowerCase().includes('ontbijtbox'));
        setBoxes(cat?.products ?? []);
      })
      .catch(() => setBoxes([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return { boxes, loading, slug };
}
