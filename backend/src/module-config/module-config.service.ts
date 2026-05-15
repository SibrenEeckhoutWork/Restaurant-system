import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleConfig } from './module-config.entity.js';

@Injectable()
export class ModuleConfigService {
  constructor(
    @InjectRepository(ModuleConfig)
    private readonly repo: Repository<ModuleConfig>,
  ) {}

  getAll(tenantId: string): Promise<ModuleConfig[]> {
    return this.repo.find({ where: { tenantId } });
  }

  async isRequired(permission: string, tenantId: string): Promise<boolean> {
    const config = await this.repo.findOne({ where: { permission, tenantId } });
    return config === null ? true : config.required;
  }

  async setRequired(permission: string, required: boolean, tenantId: string): Promise<ModuleConfig> {
    const existing = await this.repo.findOne({ where: { permission, tenantId } });
    if (existing) {
      existing.required = required;
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ permission, required, tenantId }));
  }
}
