import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity.js';
import { Allergy } from './allergy.entity.js';

const decimalTransformer = {
  from: (v: string | null) => (v === null ? null : parseFloat(v)),
  to: (v: number) => v,
};

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => Allergy, { eager: false })
  @JoinTable({ name: 'product_allergies_link' })
  allergies: Allergy[];

  @ManyToMany(() => Product, { eager: false })
  @JoinTable({
    name: 'product_accessories_link',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'accessoryProductId', referencedColumnName: 'id' },
  })
  accessories: Product[];
}
