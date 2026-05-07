import { OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { ConfigService } from '@nestjs/config';
export declare class AdminSeedService implements OnApplicationBootstrap {
    private readonly usersService;
    private readonly config;
    private readonly logger;
    constructor(usersService: UsersService, config: ConfigService);
    onApplicationBootstrap(): Promise<void>;
}
