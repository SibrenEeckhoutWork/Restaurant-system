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
    pages?: Partial<Record<'home' | 'reserveren' | 'bestellen' | 'kaart' | 'contact' | 'galerij', SlotEntry[]>>;
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
