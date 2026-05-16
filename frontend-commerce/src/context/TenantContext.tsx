'use client';

import { createContext, useContext } from 'react';

export interface SlotEntry {
  type: string;
  variant: string;
}

export interface ColorConfig {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  muted?: string;
}

export interface FontConfig {
  heading?: string;
  body?: string;
}

export interface SiteConfig {
  colors?: ColorConfig;
  fonts?: FontConfig;
  pages?: Partial<Record<'home' | 'reserveren' | 'bestellen' | 'kaart' | 'contact', SlotEntry[]>>;
}

export interface TenantData {
  name: string;
  slug: string;
  siteConfig: SiteConfig;
}

const TenantContext = createContext<TenantData | null>(null);

export function TenantProvider({ tenant, children }: { tenant: TenantData; children: React.ReactNode }) {
  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantData {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

export function useTenantOptional(): TenantData | null {
  return useContext(TenantContext);
}
