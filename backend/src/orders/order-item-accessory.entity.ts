import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity.js';
import { Accessory } from '../products/accessory.entity.js';

@Entity('order_item_accessories')
export class OrderItemAccessory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderItemId: string;

  @ManyToOne(() => OrderItem, (i) => i.accessories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column()
  accessoryId: string;

  @ManyToOne(() => Accessory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accessoryId' })
  accessory: Accessory;

  @Column('int')
  quantity: number;
}
