import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Table } from '../tables/table.entity.js';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  capacity: number;

  @OneToMany(() => Table, (table) => table.room)
  tables: Table[];
}
