import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../rooms/room.entity.js';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  capacity: number;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, (room) => room.tables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
