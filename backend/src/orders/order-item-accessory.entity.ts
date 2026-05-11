import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity.js';
import { Product } from '../products/product.entity.js';

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

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accessoryId' })
  accessory: Product;

  @Column('int')
  quantity: number;
}
