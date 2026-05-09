import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  icon: string | null;
}
