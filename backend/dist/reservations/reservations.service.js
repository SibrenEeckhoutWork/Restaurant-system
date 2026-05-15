"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_slot_entity_js_1 = require("./reservation-slot.entity.js");
const reservation_entity_js_1 = require("./reservation.entity.js");
const room_entity_js_1 = require("../rooms/room.entity.js");
const customer_entity_js_1 = require("../customers/customer.entity.js");
let ReservationsService = class ReservationsService {
    slotRepo;
    reservationRepo;
    roomRepo;
    customerRepo;
    constructor(slotRepo, reservationRepo, roomRepo, customerRepo) {
        this.slotRepo = slotRepo;
        this.reservationRepo = reservationRepo;
        this.roomRepo = roomRepo;
        this.customerRepo = customerRepo;
    }
    async resolveRooms(roomIds, tenantId) {
        if (!roomIds.length)
            return { rooms: [], maxCapacity: 0 };
        const rooms = await this.roomRepo.find({
            where: { id: (0, typeorm_2.In)(roomIds), tenantId },
            relations: { tables: true },
        });
        const maxCapacity = rooms.reduce((sum, r) => sum + r.tables.reduce((s, t) => s + t.capacity, 0), 0);
        return { rooms, maxCapacity };
    }
    slotMatchesDate(slot, date) {
        const d = new Date(date + 'T00:00:00');
        if (slot.recurrence === reservation_slot_entity_js_1.SlotRecurrence.WEEKLY) {
            const days = slot.daysOfWeek ?? [];
            return days.includes(d.getDay());
        }
        if (slot.recurrence === reservation_slot_entity_js_1.SlotRecurrence.MONTHLY) {
            return d.getDate() === (slot.monthDay ?? 1);
        }
        return true;
    }
    async createSlot(dto, tenantId) {
        const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds, tenantId);
        const slot = this.slotRepo.create({
            startTime: dto.startTime,
            endTime: dto.endTime,
            isActive: dto.isActive ?? true,
            maxCapacity,
            rooms,
            tenantId,
            recurrence: dto.recurrence ?? reservation_slot_entity_js_1.SlotRecurrence.DAILY,
            daysOfWeek: dto.daysOfWeek ?? null,
            monthDay: dto.monthDay ?? null,
        });
        return this.slotRepo.save(slot);
    }
    async findSlots(tenantId, opts = {}) {
        const qb = this.slotRepo
            .createQueryBuilder('slot')
            .leftJoinAndSelect('slot.rooms', 'room')
            .where('slot.tenantId = :tenantId', { tenantId })
            .orderBy('slot.startTime', 'ASC');
        if (opts.date) {
            qb.leftJoinAndSelect('slot.reservations', 'res', 'res.date = :date AND res.status != :cancelled', { date: opts.date, cancelled: reservation_entity_js_1.ReservationStatus.CANCELLED });
        }
        const all = await qb.getMany();
        if (!opts.date)
            return all;
        return all.filter((s) => this.slotMatchesDate(s, opts.date));
    }
    async findSlotById(id, tenantId) {
        const slot = await this.slotRepo.findOne({
            where: { id, tenantId },
            relations: { rooms: true },
        });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        return slot;
    }
    async updateSlot(id, dto, tenantId) {
        const slot = await this.findSlotById(id, tenantId);
        if (dto.roomIds) {
            const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds, tenantId);
            slot.rooms = rooms;
            slot.maxCapacity = maxCapacity;
        }
        if (dto.isActive !== undefined)
            slot.isActive = dto.isActive;
        if (dto.startTime)
            slot.startTime = dto.startTime;
        if (dto.endTime)
            slot.endTime = dto.endTime;
        if (dto.recurrence)
            slot.recurrence = dto.recurrence;
        if (dto.daysOfWeek !== undefined)
            slot.daysOfWeek = dto.daysOfWeek;
        if (dto.monthDay !== undefined)
            slot.monthDay = dto.monthDay;
        return this.slotRepo.save(slot);
    }
    async removeSlot(id, tenantId) {
        const slot = await this.findSlotById(id, tenantId);
        await this.slotRepo.remove(slot);
    }
    async getBookedTableIdsForDate(date, tableIds) {
        if (!tableIds.length)
            return new Set();
        const rows = await this.reservationRepo
            .createQueryBuilder('r')
            .select('r.tableId', 'tableId')
            .where('r.date = :date', { date })
            .andWhere('r.status != :cancelled', { cancelled: reservation_entity_js_1.ReservationStatus.CANCELLED })
            .andWhere('r.tableId IS NOT NULL')
            .andWhere('r.tableId IN (:...tableIds)', { tableIds })
            .distinct(true)
            .getRawMany();
        return new Set(rows.map((r) => r.tableId));
    }
    async getAvailableDatesForMonth(year, month, partySize, tenantId) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const today = new Date().toISOString().slice(0, 10);
        const pad = (n) => String(n).padStart(2, '0');
        const available = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const iso = `${year}-${pad(month)}-${pad(d)}`;
            if (iso < today)
                continue;
            const slots = await this.getAvailability(iso, partySize, tenantId);
            if (slots.length > 0)
                available.push(iso);
        }
        return available;
    }
    async getAvailability(date, partySize, tenantId) {
        const slots = await this.findSlots(tenantId, { date });
        const activeSlots = slots.filter((s) => s.isActive);
        if (!activeSlots.length)
            return [];
        const slotsWithTables = await this.slotRepo.find({
            where: { id: (0, typeorm_2.In)(activeSlots.map((s) => s.id)), tenantId },
            relations: { rooms: { tables: true } },
        });
        const slotTablesMap = new Map(slotsWithTables.map((s) => [s.id, s.rooms.flatMap((r) => r.tables)]));
        const allTableIds = [...new Set(slotsWithTables.flatMap((s) => s.rooms.flatMap((r) => r.tables.map((t) => t.id))))];
        const bookedTableIds = await this.getBookedTableIdsForDate(date, allTableIds);
        return activeSlots.filter((slot) => (slotTablesMap.get(slot.id) ?? []).some((t) => !bookedTableIds.has(t.id) && t.capacity >= partySize));
    }
    findAll(tenantId, opts = {}) {
        const qb = this.reservationRepo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.customer', 'customer')
            .leftJoinAndSelect('r.table', 'table')
            .leftJoinAndSelect('r.slot', 'slot')
            .where('r.tenantId = :tenantId', { tenantId })
            .orderBy('r.date', 'DESC')
            .addOrderBy('slot.startTime', 'ASC');
        if (opts.date)
            qb.andWhere('r.date = :date', { date: opts.date });
        if (opts.fromDate)
            qb.andWhere('r.date >= :fromDate', { fromDate: opts.fromDate });
        if (opts.toDate)
            qb.andWhere('r.date <= :toDate', { toDate: opts.toDate });
        if (opts.status)
            qb.andWhere('r.status = :status', { status: opts.status });
        return qb.getMany();
    }
    async findById(id, tenantId) {
        const r = await this.reservationRepo.findOne({
            where: { id, tenantId },
            relations: { customer: true, table: true, slot: { rooms: true } },
        });
        if (!r)
            throw new common_1.NotFoundException('Reservation not found');
        return r;
    }
    async createReservation(dto, tenantId) {
        const slot = await this.slotRepo.findOne({ where: { id: dto.slotId, tenantId } });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        if (!slot.isActive)
            throw new common_1.BadRequestException('Slot is not active');
        const bookedRows = await this.reservationRepo
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.partySize), 0)', 'total')
            .where('r.slotId = :slotId', { slotId: dto.slotId })
            .andWhere('r.date = :date', { date: dto.date })
            .andWhere('r.status != :cancelled', { cancelled: reservation_entity_js_1.ReservationStatus.CANCELLED })
            .getRawOne();
        const booked = parseInt(bookedRows?.total ?? '0', 10);
        if (booked + dto.partySize > slot.maxCapacity) {
            throw new common_1.BadRequestException('Insufficient capacity for this slot on this date');
        }
        const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail, tenantId } });
        return this.reservationRepo.save(this.reservationRepo.create({
            date: dto.date,
            slotId: dto.slotId,
            tableId: dto.tableId,
            partySize: dto.partySize,
            guestName: dto.guestName,
            guestEmail: dto.guestEmail,
            guestPhone: dto.guestPhone ?? null,
            notes: dto.notes ?? null,
            customerId: customer?.id ?? null,
            tenantId,
            status: reservation_entity_js_1.ReservationStatus.PENDING,
        }));
    }
    async createPublicReservation(dto, tenantId) {
        const slot = await this.slotRepo.findOne({
            where: { id: dto.slotId, tenantId },
            relations: { rooms: { tables: true } },
        });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        if (!slot.isActive)
            throw new common_1.BadRequestException('Slot is not active');
        const tables = slot.rooms.flatMap((r) => r.tables);
        if (!tables.length)
            throw new common_1.BadRequestException('No tables configured for this slot');
        const allTableIds = tables.map((t) => t.id);
        const bookedTableIds = await this.getBookedTableIdsForDate(dto.date, allTableIds);
        const table = tables.find((t) => !bookedTableIds.has(t.id) && t.capacity >= dto.partySize);
        if (!table)
            throw new common_1.BadRequestException('No tables available for this slot on this date');
        const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail, tenantId } });
        return this.reservationRepo.save(this.reservationRepo.create({
            date: dto.date,
            slotId: dto.slotId,
            tableId: table.id,
            partySize: dto.partySize,
            guestName: dto.guestName,
            guestEmail: dto.guestEmail,
            guestPhone: dto.guestPhone ?? null,
            notes: dto.notes ?? null,
            customerId: customer?.id ?? null,
            tenantId,
            status: reservation_entity_js_1.ReservationStatus.PENDING,
        }));
    }
    async updateStatus(id, dto, tenantId) {
        const r = await this.findById(id, tenantId);
        r.status = dto.status;
        return this.reservationRepo.save(r);
    }
    async remove(id, tenantId) {
        const r = await this.findById(id, tenantId);
        await this.reservationRepo.remove(r);
    }
    async bulkRemove(ids, tenantId) {
        await this.reservationRepo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_slot_entity_js_1.ReservationSlot)),
    __param(1, (0, typeorm_1.InjectRepository)(reservation_entity_js_1.Reservation)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_js_1.Room)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_js_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map