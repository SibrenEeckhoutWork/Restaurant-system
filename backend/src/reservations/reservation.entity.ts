import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ReservationSlot } from './reservation-slot.entity.js';
import { Customer } from '../customers/customer.entity.js';
import { Table } from '../tables/table.entity.js';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  customerId: string | null;

  @ManyToOne(() => Customer, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;

  @Column()
  tableId: string;

  @ManyToOne(() => Table, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @Column()
  slotId: string;

  @ManyToOne(() => ReservationSlot, (slot) => slot.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slotId' })
  slot: ReservationSlot;

  @Column('int')
  partySize: number;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @Column()
  guestName: string;

  @Column()
  guestEmail: string;

  @Column({ nullable: true, type: 'text' })
  guestPhone: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
