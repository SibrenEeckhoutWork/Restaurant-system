import { ReservationSlot } from './reservation-slot.entity.js';
import { Customer } from '../customers/customer.entity.js';
import { Table } from '../tables/table.entity.js';
export declare enum ReservationStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled"
}
export declare class Reservation {
    id: string;
    date: string;
    customerId: string | null;
    customer: Customer | null;
    tableId: string;
    table: Table;
    slotId: string;
    slot: ReservationSlot;
    partySize: number;
    status: ReservationStatus;
    notes: string | null;
    guestName: string;
    guestEmail: string;
    guestPhone: string | null;
    createdAt: Date;
}
