import {
  IsString,
  IsArray,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RecurrenceType {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class BulkCreateSlotsDto {
  @ApiProperty({ example: '12:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;

  @ApiProperty({ type: [String], description: 'Room IDs — capacity is computed from their tables' })
  @IsArray()
  @IsUUID('4', { each: true })
  roomIds: string[];

  @ApiProperty({ enum: RecurrenceType })
  @IsEnum(RecurrenceType)
  recurrence: RecurrenceType;

  @ApiProperty({ example: '2026-05-09' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @ApiPropertyOptional({ example: '2026-05-31' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate?: string;

  @ApiPropertyOptional({ example: [1, 2, 3, 4, 5], description: '0=Sun, 1=Mon, ..., 6=Sat' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekDays?: number[];

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  monthDay?: number;
}
