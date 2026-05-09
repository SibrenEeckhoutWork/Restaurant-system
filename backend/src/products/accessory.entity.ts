import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

const decimalTransformer = {
  from: (v: string | null) => (v === null ? null : parseFloat(v)),
  to: (v: number) => v,
};

@Entity('product_accessories')
export class Accessory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  price: number;
}
