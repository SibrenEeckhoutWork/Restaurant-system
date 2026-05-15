import { ReservationsService } from './reservations.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationStatus } from './reservation.entity.js';
import { TenantsService } from '../tenants/tenants.service.js';
export declare class ReservationsController {
    private readonly service;
    private readonly tenantsService;
    constructor(service: ReservationsService, tenantsService: TenantsService);
    getAvailability(tenantSlug: string, date: string, partySize: number): Promise<import("./reservation-slot.entity.js").ReservationSlot[]>;
    getAvailableDates(tenantSlug: string, year: number, month: number, partySize: number): Promise<string[]>;
    createPublic(dto: CreatePublicReservationDto): Promise<import("./reservation.entity.js").Reservation>;
    findSlots(tenantId: string, date?: string): Promise<import("./reservation-slot.entity.js").ReservationSlot[]>;
    createSlot(dto: CreateSlotDto, tenantId: string): Promise<import("./reservation-slot.entity.js").ReservationSlot>;
    updateSlot(id: string, dto: UpdateSlotDto, tenantId: string): Promise<import("./reservation-slot.entity.js").ReservationSlot>;
    removeSlot(id: string, tenantId: string): Promise<void>;
    findAll(tenantId: string, date?: string, fromDate?: string, toDate?: string, status?: ReservationStatus): Promise<import("./reservation.entity.js").Reservation[]>;
    createAdmin(dto: CreateReservationDto, tenantId: string): Promise<import("./reservation.entity.js").Reservation>;
    findOne(id: string, tenantId: string): Promise<import("./reservation.entity.js").Reservation>;
    updateStatus(id: string, dto: UpdateReservationStatusDto, tenantId: string): Promise<import("./reservation.entity.js").Reservation>;
    createForCustomer(dto: CreateReservationDto, tenantId: string): Promise<import("./reservation.entity.js").Reservation>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    removeForCustomer(id: string, tenantId: string): Promise<void>;
}
