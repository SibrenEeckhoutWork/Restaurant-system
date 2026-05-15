import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Category } from '../products/category.entity.js';
import { Product } from '../products/product.entity.js';
import { TenantsService } from '../tenants/tenants.service.js';
export declare class MenuSeedService implements OnApplicationBootstrap {
    private readonly categoryRepo;
    private readonly productRepo;
    private readonly tenantsService;
    private readonly config;
    private readonly logger;
    constructor(categoryRepo: Repository<Category>, productRepo: Repository<Product>, tenantsService: TenantsService, config: ConfigService);
    onApplicationBootstrap(): Promise<void>;
    private upsertCategory;
    private upsertProduct;
}
