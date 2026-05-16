import { Repository } from 'typeorm';
import { Tenant, SiteConfig } from './tenant.entity.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto.js';
export declare class TenantsService {
    private readonly repo;
    constructor(repo: Repository<Tenant>);
    findAll(): Promise<Tenant[]>;
    findById(id: string): Promise<Tenant>;
    findBySlug(slug: string): Promise<Tenant | null>;
    count(): Promise<number>;
    create(dto: CreateTenantDto): Promise<Tenant>;
    update(id: string, dto: UpdateTenantDto): Promise<Tenant>;
    remove(id: string): Promise<void>;
    getSiteConfig(id: string): Promise<SiteConfig>;
    updateSiteConfig(id: string, dto: UpdateSiteConfigDto): Promise<SiteConfig>;
}
