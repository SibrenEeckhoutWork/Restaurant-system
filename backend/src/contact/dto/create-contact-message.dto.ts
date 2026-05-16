import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  naam: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefoon?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  onderwerp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bericht: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantSlug: string;
}
