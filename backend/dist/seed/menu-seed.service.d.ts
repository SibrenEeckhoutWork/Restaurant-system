import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../products/category.entity.js';
import { Product } from '../products/product.entity.js';
export declare class MenuSeedService implements OnApplicationBootstrap {
    private readonly categoryRepo;
    private readonly productRepo;
    private readonly logger;
    constructor(categoryRepo: Repository<Category>, productRepo: Repository<Product>);
    onApplicationBootstrap(): Promise<void>;
    private upsertCategory;
    private upsertProduct;
}
