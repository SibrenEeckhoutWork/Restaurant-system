import { IsOptional } from 'class-validator';
import type { ColorConfig, FontConfig, SlotEntry } from '../tenant.entity.js';

export class UpdateSiteConfigDto {
  @IsOptional()
  colors?: ColorConfig;

  @IsOptional()
  fonts?: FontConfig;

  @IsOptional()
  pages?: Partial<Record<string, SlotEntry[]>>;
}
