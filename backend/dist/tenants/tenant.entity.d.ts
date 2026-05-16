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
export declare class Tenant {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    siteConfig: SiteConfig | null;
    createdAt: Date;
    updatedAt: Date;
}
