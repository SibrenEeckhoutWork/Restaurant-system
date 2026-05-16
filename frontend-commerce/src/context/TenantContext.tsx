'use client';

import { createContext, useContext } from 'react';

export interface SlotEntry {
  parent: string;
  child: string;
}

export interface PageConfig {
  active: boolean;
  slots: SlotEntry[];
}

export interface NavChildItem {
  active: boolean;
  label: string;
  href: string;
}

export interface NavItemConfig {
  active: boolean;
  label?: string;
  path?: string;
  order?: number;
  children?: NavChildItem[];
}

export type PageKey = 'home' | 'reserveren' | 'bestellen' | 'kaart' | 'contact' | 'galerij';

export interface NavConfig {
  items?: Partial<Record<PageKey, NavItemConfig>>;
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
  nav?: NavConfig;
  pages?: Partial<Record<PageKey, PageConfig>>;
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
