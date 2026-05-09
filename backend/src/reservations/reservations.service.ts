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

  private async resolveRooms(roomIds: string[]): Promise<{ rooms: Room[]; maxCapacity: number }> {
    if (!roomIds.length) return { rooms: [], maxCapacity: 0 };
    const rooms = await this.roomRepo.find({
      where: { id: In(roomIds) },
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

  async createSlot(dto: CreateSlotDto): Promise<ReservationSlot> {
    const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds);
    const slot = this.slotRepo.create({
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive ?? true,
      maxCapacity,
      rooms,
      recurrence: dto.recurrence ?? SlotRecurrence.DAILY,
      daysOfWeek: dto.daysOfWeek ?? null,
      monthDay: dto.monthDay ?? null,
    });
    return this.slotRepo.save(slot);
  }

  async findSlots(opts: { date?: string } = {}): Promise<ReservationSlot[]> {
    const qb = this.slotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.rooms', 'room')
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

  async findSlotById(id: string): Promise<ReservationSlot> {
    const slot = await this.slotRepo.findOne({
      where: { id },
      relations: { rooms: true },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    return slot;
  }

  async updateSlot(id: string, dto: UpdateSlotDto): Promise<ReservationSlot> {
    const slot = await this.findSlotById(id);
    if (dto.roomIds) {
      const { rooms, maxCapacity } = await this.resolveRooms(dto.roomIds);
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

  async removeSlot(id: string): Promise<void> {
    const slot = await this.findSlotById(id);
    await this.slotRepo.remove(slot);
  }

  async getAvailability(date: string, partySize: number): Promise<ReservationSlot[]> {
    const slots = await this.findSlots({ date });
    return slots.filter((slot) => {
      if (!slot.isActive) return false;
      const booked = (slot.reservations ?? []).reduce((sum, r) => sum + r.partySize, 0);
      return slot.maxCapacity - booked >= partySize;
    });
  }

  // ── Reservations ──────────────────────────────────────────────────────────

  findAll(opts: {
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
      .orderBy('r.date', 'DESC')
      .addOrderBy('slot.startTime', 'ASC');

    if (opts.date) qb.andWhere('r.date = :date', { date: opts.date });
    if (opts.fromDate) qb.andWhere('r.date >= :fromDate', { fromDate: opts.fromDate });
    if (opts.toDate) qb.andWhere('r.date <= :toDate', { toDate: opts.toDate });
    if (opts.status) qb.andWhere('r.status = :status', { status: opts.status });

    return qb.getMany();
  }

  async findById(id: string): Promise<Reservation> {
    const r = await this.reservationRepo.findOne({
      where: { id },
      relations: { customer: true, table: true, slot: { rooms: true } },
    });
    if (!r) throw new NotFoundException('Reservation not found');
    return r;
  }

  async createReservation(dto: CreateReservationDto): Promise<Reservation> {
    const slot = await this.slotRepo.findOne({ where: { id: dto.slotId } });
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

    const customer = await this.customerRepo.findOne({ where: { email: dto.guestEmail } });

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
        status: ReservationStatus.PENDING,
      }),
    );
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<Reservation> {
    const r = await this.findById(id);
    r.status = dto.status;
    return this.reservationRepo.save(r);
  }

  async remove(id: string): Promise<void> {
    const r = await this.findById(id);
    await this.reservationRepo.remove(r);
  }
}
