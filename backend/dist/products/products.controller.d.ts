import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateAllergyDto } from './dto/create-allergy.dto.js';
import { UpdateAllergyDto } from './dto/update-allergy.dto.js';
import { CreateAccessoryDto } from './dto/create-accessory.dto.js';
import { UpdateAccessoryDto } from './dto/update-accessory.dto.js';
export declare class CategoriesController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(): Promise<import("./category.entity.js").Category[]>;
    findOne(id: string): Promise<import("./category.entity.js").Category>;
    create(dto: CreateCategoryDto): Promise<import("./category.entity.js").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("./category.entity.js").Category>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
export declare class AllergiesController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(): Promise<import("./allergy.entity.js").Allergy[]>;
    findOne(id: string): Promise<import("./allergy.entity.js").Allergy>;
    create(dto: CreateAllergyDto): Promise<import("./allergy.entity.js").Allergy>;
    update(id: string, dto: UpdateAllergyDto): Promise<import("./allergy.entity.js").Allergy>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
export declare class AccessoriesController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(): Promise<import("./accessory.entity.js").Accessory[]>;
    findOne(id: string): Promise<import("./accessory.entity.js").Accessory>;
    create(dto: CreateAccessoryDto): Promise<import("./accessory.entity.js").Accessory>;
    update(id: string, dto: UpdateAccessoryDto): Promise<import("./accessory.entity.js").Accessory>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    findAll(): Promise<import("./product.entity.js").Product[]>;
    findOne(id: string): Promise<import("./product.entity.js").Product>;
    create(dto: CreateProductDto): Promise<import("./product.entity.js").Product>;
    update(id: string, dto: UpdateProductDto): Promise<import("./product.entity.js").Product>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
