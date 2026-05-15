import { Repository } from 'typeorm';
import { ModuleConfig } from './module-config.entity.js';
export declare class ModuleConfigService {
    private readonly repo;
    constructor(repo: Repository<ModuleConfig>);
    getAll(tenantId: string): Promise<ModuleConfig[]>;
    isRequired(permission: string, tenantId: string): Promise<boolean>;
    setRequired(permission: string, required: boolean, tenantId: string): Promise<ModuleConfig>;
}
