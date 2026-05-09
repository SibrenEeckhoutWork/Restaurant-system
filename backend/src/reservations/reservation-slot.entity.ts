import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Reservation } from './reservation.entity.js';
import { Room } from '../rooms/room.entity.js';

export enum SlotRecurrence {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity('reservation_slots')
export class ReservationSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column('int')
  maxCapacity: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: SlotRecurrence, default: SlotRecurrence.DAILY })
  recurrence: SlotRecurrence;

  // For weekly: array of day-of-week numbers (0=Sun, 1=Mon, …, 6=Sat)
  @Column({ type: 'json', nullable: true })
  daysOfWeek: number[] | null;

  // For monthly: day-of-month (1–31)
  @Column({ nullable: true, type: 'int' })
  monthDay: number | null;

  @ManyToMany(() => Room, { eager: false })
  @JoinTable({ name: 'reservation_slot_rooms' })
  rooms: Room[];

  @OneToMany(() => Reservation, (r) => r.slot)
  reservations: Reservation[];
}
