import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity.js';
import { Product } from '../products/product.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';

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

  @OneToMany(() => OrderItemAccessory, (a) => a.orderItem, { cascade: true, eager: false })
  accessories: OrderItemAccessory[];
}
