import { SlotRecurrence } from '../reservation-slot.entity.js';
export declare class UpdateSlotDto {
    isActive?: boolean;
    roomIds?: string[];
    startTime?: string;
    endTime?: string;
    recurrence?: SlotRecurrence;
    daysOfWeek?: number[];
    monthDay?: number;
}
