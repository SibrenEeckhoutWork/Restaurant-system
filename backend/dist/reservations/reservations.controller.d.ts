import { ReservationsService } from './reservations.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationStatus } from './reservation.entity.js';
export declare class ReservationsController {
    private readonly service;
    constructor(service: ReservationsService);
    getAvailability(date: string, partySize: number): Promise<import("./reservation-slot.entity.js").ReservationSlot[]>;
    findSlots(date?: string): Promise<import("./reservation-slot.entity.js").ReservationSlot[]>;
    createSlot(dto: CreateSlotDto): Promise<import("./reservation-slot.entity.js").ReservationSlot>;
    updateSlot(id: string, dto: UpdateSlotDto): Promise<import("./reservation-slot.entity.js").ReservationSlot>;
    removeSlot(id: string): Promise<void>;
    findAll(date?: string, fromDate?: string, toDate?: string, status?: ReservationStatus): Promise<import("./reservation.entity.js").Reservation[]>;
    createAdmin(dto: CreateReservationDto): Promise<import("./reservation.entity.js").Reservation>;
    findOne(id: string): Promise<import("./reservation.entity.js").Reservation>;
    updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<import("./reservation.entity.js").Reservation>;
    createForCustomer(dto: CreateReservationDto): Promise<import("./reservation.entity.js").Reservation>;
    removeForCustomer(id: string): Promise<void>;
}
