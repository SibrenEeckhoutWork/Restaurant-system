import { ModuleConfigService } from './module-config.service.js';
export declare class ModuleConfigController {
    private readonly service;
    constructor(service: ModuleConfigService);
    getAll(): Promise<import("./module-config.entity.js").ModuleConfig[]>;
    update(permission: string, body: {
        required: boolean;
    }): Promise<import("./module-config.entity.js").ModuleConfig>;
}
