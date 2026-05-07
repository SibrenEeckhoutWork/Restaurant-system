import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('module_configs')
export class ModuleConfig {
  @PrimaryColumn()
  permission: string;

  @Column({ default: true })
  required: boolean;
}
