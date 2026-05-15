import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateAllergyDto } from './dto/create-allergy.dto.js';
import { UpdateAllergyDto } from './dto/update-allergy.dto.js';
import { TenantsService } from '../tenants/tenants.service.js';
export declare class MenuController {
    private readonly service;
    private readonly tenantsService;
    constructor(service: ProductsService, tenantsService: TenantsService);
    getMenu(tenantSlug: string): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        products: import("./product.entity.js").Product[];
    }[]>;
}
export declare class CategoriesController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(tenantId: string): Promise<import("./category.entity.js").Category[]>;
    findOne(id: string, tenantId: string): Promise<import("./category.entity.js").Category>;
    create(dto: CreateCategoryDto, tenantId: string): Promise<import("./category.entity.js").Category>;
    update(id: string, dto: UpdateCategoryDto, tenantId: string): Promise<import("./category.entity.js").Category>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
export declare class AllergiesController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(tenantId: string): Promise<import("./allergy.entity.js").Allergy[]>;
    findOne(id: string, tenantId: string): Promise<import("./allergy.entity.js").Allergy>;
    create(dto: CreateAllergyDto, tenantId: string): Promise<import("./allergy.entity.js").Allergy>;
    update(id: string, dto: UpdateAllergyDto, tenantId: string): Promise<import("./allergy.entity.js").Allergy>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(tenantId: string): Promise<import("./product.entity.js").Product[]>;
    findOne(id: string, tenantId: string): Promise<import("./product.entity.js").Product>;
    create(dto: CreateProductDto, tenantId: string): Promise<import("./product.entity.js").Product>;
    update(id: string, dto: UpdateProductDto, tenantId: string): Promise<import("./product.entity.js").Product>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
