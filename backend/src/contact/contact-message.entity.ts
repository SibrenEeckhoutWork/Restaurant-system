import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  naam: string;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'text' })
  telefoon: string | null;

  @Column()
  onderwerp: string;

  @Column('text')
  bericht: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
