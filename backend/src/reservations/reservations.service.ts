import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ReservationSlot, SlotRecurrence } from './reservation-slot.entity.js';
import { Reservation, ReservationStatus } from './reservation.entity.js';
import { Room } from '../rooms/room.entity.js';
import { Customer } from '../customers/customer.entity.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationSlot) private readonly slotRepo: Repository<ReservationSlot>,
    @InjectRepository(Reservation) private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
  ) {}

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async resolveRooms(roomIds: string[], tenantId: string): Promise<{ rooms: Room[]; maxCapacity: number }> {
    if (!roomIds.length) return { rooms: [], maxCapacity: 0 };
    const rooms = await this.roomRepo.find({
      where: { id: In(roomIds), tenantId },
      relations: { tables: true },
    });
    const maxCapacity = rooms.reduce(
      (sum, r) => sum + r.tables.reduce((s, t) => s + t.capacity, 0),
      0,
    );
    return { rooms, maxCapacity };
  }

  // ── Slots ─────────────────────────────────────────────────────────────────

  private slotMatchesDate(slot: ReservationSlot, date: string): boolean {
    const d = new Date(date + 'T00:00:00');
    if (slot.recurrence === SlotRecurrence.WEEKLY) {
      const days = slot.daysOfWeek ?? [];
      return days.includes(d.getDay());
    }
    if (slot.recurrence === SlotRecurrence.MONTHLY) {
      return d.getDate() === (slot.monthDay ?? 1);
    }
    return true; // daily
  }

  async createSlot(dto: CreateSlotDto, tenantId: string): Promise<ReservationSlot> {
    const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds, tenantId);
    const slot = this.slotRepo.create({
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive ?? true,
      maxCapacity,
      rooms,
      tenantId,
      recurrence: dto.recurrence ?? SlotRecurrence.DAILY,
      daysOfWeek: dto.daysOfWeek ?? null,
      monthDay: dto.monthDay ?? null,
    });
    return this.slotRepo.save(slot);
  }

  async findSlots(tenantId: string, opts: { date?: string } = {}): Promise<ReservationSlot[]> {
    const qb = this.slotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.rooms', 'room')
      .where('slot.tenantId = :tenantId', { tenantId })
      .orderBy('slot.startTime', 'ASC');

    if (opts.date) {
      qb.leftJoinAndSelect(
        'slot.reservations',
        'res',
        'res.date = :date AND res.status != :cancelled',
        { date: opts.date, cancelled: ReservationStatus.CANCELLED },
      );
    }

    const all = await qb.getMany();
    if (!opts.date) return all;
    return all.filter((s) => this.slotMatchesDate(s, opts.date!));
  }

  async findSlotById(id: string, tenantId: string): Promise<ReservationSlot> {
    const slot = await this.slotRepo.findOne({
      where: { id, tenantId },
      relations: { rooms: true },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    return slot;
  }

  async updateSlot(id: string, dto: UpdateSlotDto, tenantId: string): Promise<ReservationSlot> {
    const slot = await this.findSlotById(id, tenantId);
    if (dto.roomIds) {
      const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds, tenantId);
      slot.rooms = rooms;
      slot.maxCapacity = maxCapacity;
    }
    if (dto.isActive !== undefined) slot.isActive = dto.isActive;
    if (dto.startTime) slot.startTime = dto.startTime;
    if (dto.endTime) slot.endTime = dto.endTime;
    if (dto.recurrence) slot.recurrence = dto.recurrence;
    if (dto.daysOfWeek !== undefined) slot.daysOfWeek = dto.daysOfWeek;
    if (dto.monthDay !== undefined) slot.monthDay = dto.monthDay;
    return this.slotRepo.save(slot);
  }

  async removeSlot(id: string, tenantId: string): Promise<void> {
    const slot = await this.findSlotById(id, tenantId);
    await this.slotRepo.remove(slot);
  }

  // Returns booked tableIds on a given date (across all slots — a table booked in any slot is unavailable).
  private async getBookedTableIdsForDate(date: string, tableIds: string[]): Promise<Set<string>> {
    if (!tableIds.length) return new Set();
    const rows = await this.reservationRepo
      .createQueryBuilder('r')
      .select('r.tableId', 'tableId')
      .where('r.date = :date', { date })
      .andWhere('r.status != :cancelled', { cancelled: ReservationStatus.CANCELLED })
      .andWhere('r.tableId IS NOT NULL')
      .andWhere('r.tableId IN (:...tableIds)', { tableIds })
      .distinct(true)
      .getRawMany<{ tableId: string }>();
    return new Set(rows.map((r) => r.tableId));
  }

  async getAvailableDatesForMonth(year: number, month: number, partySize: number, tenantId: string): Promise<string[]> {
    const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-based here
    const today = new Date().toISOString().slice(0, 10);
    const pad = (n: number) => String(n).padStart(2, '0');

    const available: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${pad(month)}-${pad(d)}`;
      if (iso < today) continue;
      const slots = await this.getAvailability(iso, partySize, tenantId);
      if (slots.length > 0) available.push(iso);
    }
    return available;
  }

  async getAvailability(date: string, partySize: number, tenantId: string): Promise<ReservationSlot[]> {
    const slots = await this.findSlots(tenantId, { date });
    const activeSlots = slots.filter((s) => s.isActive);
    if (!activeSlots.length) return [];

    // Load rooms with tables (findSlots only loads rooms without tables)
    const slotsWithTables = await this.slotRepo.find({
      where: { id: In(activeSlots.map((s) => s.id)), tenantId },
      relations: { rooms: { tables: true } },
    });
    const slotTablesMap = new Map(slotsWithTables.map((s) => [s.id, s.rooms.flatMap((r) => r.tables)]));

    const allTableIds = [...new Set(slotsWithTables.flatMap((s) => s.rooms.flatMap((r) => r.tables.map((t) => t.id))))];
    const bookedTableIds = await this.getBookedTableIdsForDate(date, allTableIds);

    // Slot available if it has at least one free table with enough capacity
    return activeSlots.filter((slot) =>
      (slotTablesMap.get(slot.id) ?? []).some((t) => !bookedTableIds.has(t.id) && t.capacity >= partySize),
    );
  }

  // ── Reservations ──────────────────────────────────────────────────────────

  findAll(tenantId: string, opts: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: ReservationStatus;
  } = {}): Promise<Reservation[]> {
    const qb = this.reservationRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.customer', 'customer')
      .leftJoinAndSelect('r.table', 'table')
      .leftJoinAndSelect('r.slot', 'slot')
      .where('r.tenantId = :tenantId', { tenantId })
      .orderBy('r.date', 'DESC')
      .addOrderBy('slot.startTime', 'ASC');

    if (opts.date) qb.andWhere('r.date = :date', { date: opts.date });
    if (opts.fromDate) qb.andWhere('r.date >= :fromDate', { fromDate: opts.fromDate });
    if (opts.toDate) qb.andWhere('r.date <= :toDate', { toDate: opts.toDate });
    if (opts.status) qb.andWhere('r.status = :status', { status: opts.status });

    return qb.getMany();
  }

  async findById(id: string, tenantId: string): Promise<Reservation> {
    const r = await this.reservationRepo.findOne({
      where: { id, tenantId },
      relations: { customer: true, table: true, slot: { rooms: true } },
    });
    if (!r) throw new NotFoundException('Reservation not found');
    return r;
  }

  async createReservation(dto: CreateReservationDto, tenantId: string): Promise<Reservation> {
    const slot = await this.slotRepo.findOne({ where: { id: dto.slotId, tenantId } });
    if (!slot) throw new NotFoundException('Slot not found');
    if (!slot.isActive) throw new BadRequestException('Slot is not active');

    const bookedRows = await this.reservationRepo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.partySize), 0)', 'total')
      .where('r.slotId = :slotId', { slotId: dto.slotId })
      .andWhere('r.date = :date', { date: dto.date })
      .andWhere('r.status != :cancelled', { cancelled: ReservationStatus.CANCELLED })
      .getRawOne<{ total: string }>();

    const booked = parseInt(bookedRows?.total ?? '0', 10);
    if (booked + dto.partySize > slot.maxCapacity) {
      throw new BadRequestException('Insufficient capacity for this slot on this date');
    }

    const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail, tenantId } });

    return this.reservationRepo.save(
      this.reservationRepo.create({
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
        status: ReservationStatus.PENDING,
      }),
    );
  }

  async createPublicReservation(dto: CreatePublicReservationDto, tenantId: string): Promise<Reservation> {
    const slot = await this.slotRepo.findOne({
      where: { id: dto.slotId, tenantId },
      relations: { rooms: { tables: true } },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    if (!slot.isActive) throw new BadRequestException('Slot is not active');

    const tables = slot.rooms.flatMap((r) => r.tables);
    if (!tables.length) throw new BadRequestException('No tables configured for this slot');

    // Find a free table (not booked by any reservation on this date, cross-slot)
    const allTableIds = tables.map((t) => t.id);
    const bookedTableIds = await this.getBookedTableIdsForDate(dto.date, allTableIds);
    const table = tables.find((t) => !bookedTableIds.has(t.id) && t.capacity >= dto.partySize);
    if (!table) throw new BadRequestException('No tables available for this slot on this date');

    const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail, tenantId } });

    return this.reservationRepo.save(
      this.reservationRepo.create({
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
        status: ReservationStatus.PENDING,
      }),
    );
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto, tenantId: string): Promise<Reservation> {
    const r = await this.findById(id, tenantId);
    r.status = dto.status;
    return this.reservationRepo.save(r);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const r = await this.findById(id, tenantId);
    await this.reservationRepo.remove(r);
  }

  async bulkRemove(ids: string[], tenantId: string): Promise<void> {
    await this.reservationRepo.delete({ id: In(ids), tenantId });
  }
}
