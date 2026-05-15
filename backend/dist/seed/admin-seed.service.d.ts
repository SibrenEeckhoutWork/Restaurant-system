import { OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { ConfigService } from '@nestjs/config';
export declare class AdminSeedService implements OnApplicationBootstrap {
    private readonly usersService;
    private readonly tenantsService;
    private readonly config;
    private readonly logger;
    constructor(usersService: UsersService, tenantsService: TenantsService, config: ConfigService);
    onApplicationBootstrap(): Promise<void>;
    private seedSuperAdmin;
    private seedDefaultTenant;
}
