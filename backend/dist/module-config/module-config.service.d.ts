import { Repository } from 'typeorm';
import { ModuleConfig } from './module-config.entity.js';
export declare class ModuleConfigService {
    private readonly repo;
    constructor(repo: Repository<ModuleConfig>);
    getAll(): Promise<ModuleConfig[]>;
    isRequired(permission: string): Promise<boolean>;
    setRequired(permission: string, required: boolean): Promise<ModuleConfig>;
}
