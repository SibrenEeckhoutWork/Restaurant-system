import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service.js';
import { ModuleConfigService } from '../../module-config/module-config.service.js';
export declare class PermissionGuard implements CanActivate {
    private readonly reflector;
    private readonly usersService;
    private readonly moduleConfigService;
    constructor(reflector: Reflector, usersService: UsersService, moduleConfigService: ModuleConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
