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
    async resolveRooms(roomIds) {
        if (!roomIds.length)
            return { rooms: [], maxCapacity: 0 };
        const rooms = await this.roomRepo.find({
            where: { id: (0, typeorm_2.In)(roomIds) },
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
    async createSlot(dto) {
        const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds);
        const slot = this.slotRepo.create({
            startTime: dto.startTime,
            endTime: dto.endTime,
            isActive: dto.isActive ?? true,
            maxCapacity,
            rooms,
            recurrence: dto.recurrence ?? reservation_slot_entity_js_1.SlotRecurrence.DAILY,
            daysOfWeek: dto.daysOfWeek ?? null,
            monthDay: dto.monthDay ?? null,
        });
        return this.slotRepo.save(slot);
    }
    async findSlots(opts = {}) {
        const qb = this.slotRepo
            .createQueryBuilder('slot')
            .leftJoinAndSelect('slot.rooms', 'room')
            .orderBy('slot.startTime', 'ASC');
        if (opts.date) {
            qb.leftJoinAndSelect('slot.reservations', 'res', 'res.date = :date AND res.status != :cancelled', { date: opts.date, cancelled: reservation_entity_js_1.ReservationStatus.CANCELLED });
        }
        const all = await qb.getMany();
        if (!opts.date)
            return all;
        return all.filter((s) => this.slotMatchesDate(s, opts.date));
    }
    async findSlotById(id) {
        const slot = await this.slotRepo.findOne({
            where: { id },
            relations: { rooms: true },
        });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        return slot;
    }
    async updateSlot(id, dto) {
        const slot = await this.findSlotById(id);
        if (dto.roomIds) {
            const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds);
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
    async removeSlot(id) {
        const slot = await this.findSlotById(id);
        await this.slotRepo.remove(slot);
    }
    async getAvailability(date, partySize) {
        const slots = await this.findSlots({ date });
        return slots.filter((slot) => {
            if (!slot.isActive)
                return false;
            const booked = (slot.reservations ?? []).reduce((sum, r) => sum + r.partySize, 0);
            return slot.maxCapacity - booked >= partySize;
        });
    }
    findAll(opts = {}) {
        const qb = this.reservationRepo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.customer', 'customer')
            .leftJoinAndSelect('r.table', 'table')
            .leftJoinAndSelect('r.slot', 'slot')
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
    async findById(id) {
        const r = await this.reservationRepo.findOne({
            where: { id },
            relations: { customer: true, table: true, slot: { rooms: true } },
        });
        if (!r)
            throw new common_1.NotFoundException('Reservation not found');
        return r;
    }
    async createReservation(dto) {
        const slot = await this.slotRepo.findOne({ where: { id: dto.slotId } });
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
        const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail } });
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
            status: reservation_entity_js_1.ReservationStatus.PENDING,
        }));
    }
    async updateStatus(id, dto) {
        const r = await this.findById(id);
        r.status = dto.status;
        return this.reservationRepo.save(r);
    }
    async remove(id) {
        const r = await this.findById(id);
        await this.reservationRepo.remove(r);
    }
    async bulkRemove(ids) {
        await this.reservationRepo.delete({ id: (0, typeorm_2.In)(ids) });
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