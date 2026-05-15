import { IsString, IsNotEmpty, IsBoolean, IsOptional, Matches, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug may only contain lowercase letters, numbers and hyphens' })
  slug: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
