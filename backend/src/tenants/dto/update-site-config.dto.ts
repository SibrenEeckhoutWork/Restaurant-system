import { IsOptional } from 'class-validator';
import type { ColorConfig, FontConfig, PageConfig, NavConfig } from '../tenant.entity.js';

export class UpdateSiteConfigDto {
  @IsOptional()
  colors?: ColorConfig;

  @IsOptional()
  fonts?: FontConfig;

  @IsOptional()
  nav?: NavConfig;

  @IsOptional()
  pages?: Partial<Record<string, PageConfig>>;
}
