import { ModuleConfigService } from './module-config.service.js';
export declare class ModuleConfigController {
    private readonly service;
    constructor(service: ModuleConfigService);
    getAll(tenantId: string): Promise<import("./module-config.entity.js").ModuleConfig[]>;
    update(permission: string, body: {
        required: boolean;
    }, tenantId: string): Promise<import("./module-config.entity.js").ModuleConfig>;
}
