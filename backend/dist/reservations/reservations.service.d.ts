import { Repository } from 'typeorm';
import { ReservationSlot } from './reservation-slot.entity.js';
import { Reservation, ReservationStatus } from './reservation.entity.js';
import { Room } from '../rooms/room.entity.js';
import { Customer } from '../customers/customer.entity.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
export declare class ReservationsService {
    private readonly slotRepo;
    private readonly reservationRepo;
    private readonly roomRepo;
    private readonly customerRepo;
    constructor(slotRepo: Repository<ReservationSlot>, reservationRepo: Repository<Reservation>, roomRepo: Repository<Room>, customerRepo: Repository<Customer>);
    private resolveRooms;
    private slotMatchesDate;
    createSlot(dto: CreateSlotDto, tenantId: string): Promise<ReservationSlot>;
    findSlots(tenantId: string, opts?: {
        date?: string;
    }): Promise<ReservationSlot[]>;
    findSlotById(id: string, tenantId: string): Promise<ReservationSlot>;
    updateSlot(id: string, dto: UpdateSlotDto, tenantId: string): Promise<ReservationSlot>;
    removeSlot(id: string, tenantId: string): Promise<void>;
    private getBookedTableIdsForDate;
    getAvailableDatesForMonth(year: number, month: number, partySize: number, tenantId: string): Promise<string[]>;
    getAvailability(date: string, partySize: number, tenantId: string): Promise<ReservationSlot[]>;
    findAll(tenantId: string, opts?: {
        date?: string;
        fromDate?: string;
        toDate?: string;
        status?: ReservationStatus;
    }): Promise<Reservation[]>;
    findById(id: string, tenantId: string): Promise<Reservation>;
    createReservation(dto: CreateReservationDto, tenantId: string): Promise<Reservation>;
    createPublicReservation(dto: CreatePublicReservationDto, tenantId: string): Promise<Reservation>;
    updateStatus(id: string, dto: UpdateReservationStatusDto, tenantId: string): Promise<Reservation>;
    remove(id: string, tenantId: string): Promise<void>;
    bulkRemove(ids: string[], tenantId: string): Promise<void>;
}
