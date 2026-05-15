import type { Request } from 'express';
import { ModuleConfigService } from './module-config.service.js';
import { UsersService } from '../users/users.service.js';
import type { JwtPayload } from '../auth/strategies/jwt-access.strategy.js';
export declare class ModuleConfigController {
    private readonly service;
    private readonly usersService;
    constructor(service: ModuleConfigService, usersService: UsersService);
    getAll(tenantId: string): Promise<import("./module-config.entity.js").ModuleConfig[]>;
    update(permission: string, body: {
        required: boolean;
    }, tenantId: string, req: Request & {
        user: JwtPayload;
    }): Promise<import("./module-config.entity.js").ModuleConfig>;
}
