import { SlotRecurrence } from '../reservation-slot.entity.js';
export declare class CreateSlotDto {
    startTime: string;
    endTime: string;
    roomIds: string[];
    isActive?: boolean;
    recurrence?: SlotRecurrence;
    daysOfWeek?: number[];
    monthDay?: number;
}
