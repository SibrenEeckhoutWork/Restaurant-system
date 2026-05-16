import type { ColorConfig, FontConfig, PageConfig, NavConfig } from '../tenant.entity.js';
export declare class UpdateSiteConfigDto {
    colors?: ColorConfig;
    fonts?: FontConfig;
    nav?: NavConfig;
    pages?: Partial<Record<string, PageConfig>>;
}
