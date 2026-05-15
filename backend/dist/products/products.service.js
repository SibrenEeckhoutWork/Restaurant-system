"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_js_1 = require("./product.entity.js");
const category_entity_js_1 = require("./category.entity.js");
const allergy_entity_js_1 = require("./allergy.entity.js");
let ProductsService = class ProductsService {
    productRepo;
    categoryRepo;
    allergyRepo;
    constructor(productRepo, categoryRepo, allergyRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.allergyRepo = allergyRepo;
    }
    findAllCategories(tenantId) {
        return this.categoryRepo.find({ where: { tenantId }, order: { sortOrder: 'ASC', name: 'ASC' } });
    }
    async findCategoryById(id, tenantId) {
        const c = await this.categoryRepo.findOne({ where: { id, tenantId } });
        if (!c)
            throw new common_1.NotFoundException('Category not found');
        return c;
    }
    createCategory(dto, tenantId) {
        return this.categoryRepo.save(this.categoryRepo.create({ ...dto, tenantId, sortOrder: dto.sortOrder ?? 0 }));
    }
    async updateCategory(id, dto, tenantId) {
        const c = await this.findCategoryById(id, tenantId);
        Object.assign(c, dto);
        return this.categoryRepo.save(c);
    }
    async removeCategory(id, tenantId) {
        const c = await this.findCategoryById(id, tenantId);
        await this.categoryRepo.remove(c);
    }
    async bulkRemoveCategories(ids, tenantId) {
        await this.categoryRepo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
    }
    findAllAllergies(tenantId) {
        return this.allergyRepo.find({ where: { tenantId }, order: { name: 'ASC' } });
    }
    async findAllergyById(id, tenantId) {
        const a = await this.allergyRepo.findOne({ where: { id, tenantId } });
        if (!a)
            throw new common_1.NotFoundException('Allergy not found');
        return a;
    }
    createAllergy(dto, tenantId) {
        return this.allergyRepo.save(this.allergyRepo.create({ ...dto, tenantId, icon: dto.icon ?? null }));
    }
    async updateAllergy(id, dto, tenantId) {
        const a = await this.findAllergyById(id, tenantId);
        Object.assign(a, dto);
        return this.allergyRepo.save(a);
    }
    async removeAllergy(id, tenantId) {
        const a = await this.findAllergyById(id, tenantId);
        await this.allergyRepo.remove(a);
    }
    async bulkRemoveAllergies(ids, tenantId) {
        await this.allergyRepo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
    }
    async findMenu(tenantId) {
        const products = await this.productRepo.find({
            where: { isAvailable: true, tenantId },
            relations: { category: true, allergies: true, accessories: true },
            order: { name: 'ASC' },
        });
        const map = new Map();
        for (const p of products) {
            if (!p.category)
                continue;
            if (!map.has(p.categoryId)) {
                map.set(p.categoryId, { id: p.categoryId, name: p.category.name, sortOrder: p.category.sortOrder ?? 0, products: [] });
            }
            map.get(p.categoryId).products.push(p);
        }
        return [...map.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    }
    findAllProducts(tenantId) {
        return this.productRepo.find({
            where: { tenantId },
            relations: { category: true, allergies: true, accessories: true },
            order: { name: 'ASC' },
        });
    }
    async findProductById(id, tenantId) {
        const p = await this.productRepo.findOne({
            where: { id, tenantId },
            relations: { category: true, allergies: true, accessories: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Product not found');
        return p;
    }
    async createProduct(dto, tenantId) {
        const allergies = dto.allergyIds?.length
            ? await this.allergyRepo.findBy({ id: (0, typeorm_2.In)(dto.allergyIds), tenantId })
            : [];
        const accessories = dto.accessoryIds?.length
            ? await this.productRepo.findBy({ id: (0, typeorm_2.In)(dto.accessoryIds), tenantId })
            : [];
        const product = this.productRepo.create({
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            isAvailable: dto.isAvailable ?? true,
            categoryId: dto.categoryId,
            tenantId,
            allergies,
            accessories,
        });
        return this.productRepo.save(product);
    }
    async updateProduct(id, dto, tenantId) {
        const product = await this.findProductById(id, tenantId);
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.description !== undefined)
            product.description = dto.description ?? null;
        if (dto.price !== undefined)
            product.price = dto.price;
        if (dto.isAvailable !== undefined)
            product.isAvailable = dto.isAvailable;
        if (dto.categoryId !== undefined)
            product.categoryId = dto.categoryId;
        if (dto.allergyIds !== undefined) {
            product.allergies = dto.allergyIds.length
                ? await this.allergyRepo.findBy({ id: (0, typeorm_2.In)(dto.allergyIds), tenantId })
                : [];
        }
        if (dto.accessoryIds !== undefined) {
            product.accessories = dto.accessoryIds.length
                ? await this.productRepo.findBy({ id: (0, typeorm_2.In)(dto.accessoryIds), tenantId })
                : [];
        }
        return this.productRepo.save(product);
    }
    async removeProduct(id, tenantId) {
        const product = await this.findProductById(id, tenantId);
        await this.productRepo.remove(product);
    }
    async bulkRemoveProducts(ids, tenantId) {
        await this.productRepo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_js_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_js_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(allergy_entity_js_1.Allergy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map