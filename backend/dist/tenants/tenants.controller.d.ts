import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { ModuleConfigService } from '../module-config/module-config.service.js';
export declare class TenantsController {
    private readonly svc;
    private readonly moduleConfigSvc;
    constructor(svc: TenantsService, moduleConfigSvc: ModuleConfigService);
    findAll(): Promise<import("./tenant.entity.js").Tenant[]>;
    count(): Promise<number>;
    findOne(id: string): Promise<import("./tenant.entity.js").Tenant>;
    create(dto: CreateTenantDto): Promise<import("./tenant.entity.js").Tenant>;
    update(id: string, dto: UpdateTenantDto): Promise<import("./tenant.entity.js").Tenant>;
    remove(id: string): Promise<void>;
    getModules(id: string): Promise<import("../module-config/module-config.entity.js").ModuleConfig[]>;
    setModule(id: string, permission: string, body: {
        required: boolean;
    }): Promise<import("../module-config/module-config.entity.js").ModuleConfig>;
}
