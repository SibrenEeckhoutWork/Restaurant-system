import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  sortOrder: number;
}
