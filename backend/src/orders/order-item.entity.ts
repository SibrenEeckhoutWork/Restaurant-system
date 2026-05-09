import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity.js';
import { Product } from '../products/product.entity.js';
import { Accessory } from '../products/accessory.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @ManyToMany(() => Accessory, { eager: false })
  @JoinTable({ name: 'order_item_accessories' })
  accessories: Accessory[];
}
