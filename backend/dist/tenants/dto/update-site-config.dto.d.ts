import type { ColorConfig, FontConfig, SlotEntry } from '../tenant.entity.js';
export declare class UpdateSiteConfigDto {
    colors?: ColorConfig;
    fonts?: FontConfig;
    pages?: Partial<Record<string, SlotEntry[]>>;
}
