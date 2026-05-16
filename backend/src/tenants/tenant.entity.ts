import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface SlotEntry {
  type: string;
  variant: string;
}

export interface ColorConfig {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  muted?: string;
}

export interface FontConfig {
  heading?: string;
  body?: string;
}

export interface SiteConfig {
  colors?: ColorConfig;
  fonts?: FontConfig;
  pages?: Partial<Record<'home' | 'reserveren' | 'bestellen' | 'kaart' | 'contact' | 'galerij', SlotEntry[]>>;
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  siteConfig: SiteConfig | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
