import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('module_configs')
@Unique(['tenantId', 'permission'])
export class ModuleConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  permission: string;

  @Column({ default: true })
  required: boolean;
}
