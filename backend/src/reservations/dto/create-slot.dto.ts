import {
  IsString,
  IsArray,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SlotRecurrence } from '../reservation-slot.entity.js';

export class CreateSlotDto {
  @ApiProperty({ example: '12:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;

  @ApiProperty({ type: [String], description: 'Room IDs — capacity computed from their tables' })
  @IsArray()
  @IsUUID('4', { each: true })
  roomIds: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: SlotRecurrence, default: SlotRecurrence.DAILY })
  @IsOptional()
  @IsEnum(SlotRecurrence)
  recurrence?: SlotRecurrence;

  @ApiPropertyOptional({ type: [Number], description: 'For weekly: days of week (0=Sun…6=Sat)' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  daysOfWeek?: number[];

  @ApiPropertyOptional({ description: 'For monthly: day of month (1–31)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  monthDay?: number;
}
