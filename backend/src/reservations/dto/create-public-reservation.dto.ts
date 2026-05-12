import { IsEmail, IsInt, IsOptional, IsString, IsUUID, Matches, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublicReservationDto {
  @ApiProperty({ example: '2026-05-09' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiProperty()
  @IsUUID()
  slotId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  partySize: number;

  @ApiProperty()
  @IsString()
  guestName: string;

  @ApiProperty()
  @IsEmail()
  guestEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
