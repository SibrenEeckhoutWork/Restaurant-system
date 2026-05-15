import { Reservation } from './reservation.entity.js';
import { Room } from '../rooms/room.entity.js';
export declare enum SlotRecurrence {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare class ReservationSlot {
    id: string;
    tenantId: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    isActive: boolean;
    recurrence: SlotRecurrence;
    daysOfWeek: number[] | null;
    monthDay: number | null;
    rooms: Room[];
    reservations: Reservation[];
}
