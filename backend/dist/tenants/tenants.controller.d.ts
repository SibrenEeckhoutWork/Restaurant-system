import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto.js';
import { ModuleConfigService } from '../module-config/module-config.service.js';
import { UsersService } from '../users/users.service.js';
export declare class TenantsController {
    private readonly svc;
    private readonly moduleConfigSvc;
    private readonly usersSvc;
    constructor(svc: TenantsService, moduleConfigSvc: ModuleConfigService, usersSvc: UsersService);
    getPublicBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
    }>;
    getPublicSiteConfig(slug: string): Promise<{
        name: string;
        slug: string;
        siteConfig: import("./tenant.entity.js").SiteConfig;
    }>;
    getPublicById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
    }>;
    findAll(): Promise<import("./tenant.entity.js").Tenant[]>;
    count(): Promise<number>;
    findOne(id: string): Promise<import("./tenant.entity.js").Tenant>;
    create(dto: CreateTenantDto): Promise<{
        tenant: import("./tenant.entity.js").Tenant;
        adminUser: {
            id: string;
            tenantId: string | null;
            isSuperAdmin: boolean;
            email: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            permissions: string[];
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    update(id: string, dto: UpdateTenantDto): Promise<import("./tenant.entity.js").Tenant>;
    remove(id: string): Promise<void>;
    getSiteConfig(id: string): Promise<import("./tenant.entity.js").SiteConfig>;
    updateSiteConfig(id: string, dto: UpdateSiteConfigDto): Promise<import("./tenant.entity.js").SiteConfig>;
    getModules(id: string): Promise<import("../module-config/module-config.entity.js").ModuleConfig[]>;
    setModule(id: string, permission: string, body: {
        required: boolean;
    }): Promise<import("../module-config/module-config.entity.js").ModuleConfig>;
}
