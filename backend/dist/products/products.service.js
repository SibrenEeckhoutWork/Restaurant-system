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
const accessory_entity_js_1 = require("./accessory.entity.js");
let ProductsService = class ProductsService {
    productRepo;
    categoryRepo;
    allergyRepo;
    accessoryRepo;
    constructor(productRepo, categoryRepo, allergyRepo, accessoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.allergyRepo = allergyRepo;
        this.accessoryRepo = accessoryRepo;
    }
    findAllCategories() {
        return this.categoryRepo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
    }
    async findCategoryById(id) {
        const c = await this.categoryRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Category not found');
        return c;
    }
    createCategory(dto) {
        return this.categoryRepo.save(this.categoryRepo.create({ ...dto, sortOrder: dto.sortOrder ?? 0 }));
    }
    async updateCategory(id, dto) {
        const c = await this.findCategoryById(id);
        Object.assign(c, dto);
        return this.categoryRepo.save(c);
    }
    async removeCategory(id) {
        const c = await this.findCategoryById(id);
        await this.categoryRepo.remove(c);
    }
    async bulkRemoveCategories(ids) {
        await this.categoryRepo.delete(ids);
    }
    findAllAllergies() {
        return this.allergyRepo.find({ order: { name: 'ASC' } });
    }
    async findAllergyById(id) {
        const a = await this.allergyRepo.findOne({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Allergy not found');
        return a;
    }
    createAllergy(dto) {
        return this.allergyRepo.save(this.allergyRepo.create({ ...dto, icon: dto.icon ?? null }));
    }
    async updateAllergy(id, dto) {
        const a = await this.findAllergyById(id);
        Object.assign(a, dto);
        return this.allergyRepo.save(a);
    }
    async removeAllergy(id) {
        const a = await this.findAllergyById(id);
        await this.allergyRepo.remove(a);
    }
    async bulkRemoveAllergies(ids) {
        await this.allergyRepo.delete(ids);
    }
    findAllAccessories() {
        return this.accessoryRepo.find({ order: { name: 'ASC' } });
    }
    async findAccessoryById(id) {
        const a = await this.accessoryRepo.findOne({ where: { id } });
        if (!a)
            throw new common_1.NotFoundException('Accessory not found');
        return a;
    }
    createAccessory(dto) {
        return this.accessoryRepo.save(this.accessoryRepo.create(dto));
    }
    async updateAccessory(id, dto) {
        const a = await this.findAccessoryById(id);
        Object.assign(a, dto);
        return this.accessoryRepo.save(a);
    }
    async removeAccessory(id) {
        const a = await this.findAccessoryById(id);
        await this.accessoryRepo.remove(a);
    }
    async bulkRemoveAccessories(ids) {
        await this.accessoryRepo.delete(ids);
    }
    findAllProducts() {
        return this.productRepo.find({
            relations: { category: true, allergies: true, accessories: true },
            order: { name: 'ASC' },
        });
    }
    async findProductById(id) {
        const p = await this.productRepo.findOne({
            where: { id },
            relations: { category: true, allergies: true, accessories: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Product not found');
        return p;
    }
    async createProduct(dto) {
        const allergies = dto.allergyIds?.length
            ? await this.allergyRepo.findBy({ id: (0, typeorm_2.In)(dto.allergyIds) })
            : [];
        const accessories = dto.accessoryIds?.length
            ? await this.accessoryRepo.findBy({ id: (0, typeorm_2.In)(dto.accessoryIds) })
            : [];
        const product = this.productRepo.create({
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            isAvailable: dto.isAvailable ?? true,
            categoryId: dto.categoryId,
            allergies,
            accessories,
        });
        return this.productRepo.save(product);
    }
    async updateProduct(id, dto) {
        const product = await this.findProductById(id);
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
                ? await this.allergyRepo.findBy({ id: (0, typeorm_2.In)(dto.allergyIds) })
                : [];
        }
        if (dto.accessoryIds !== undefined) {
            product.accessories = dto.accessoryIds.length
                ? await this.accessoryRepo.findBy({ id: (0, typeorm_2.In)(dto.accessoryIds) })
                : [];
        }
        return this.productRepo.save(product);
    }
    async removeProduct(id) {
        const product = await this.findProductById(id);
        await this.productRepo.remove(product);
    }
    async bulkRemoveProducts(ids) {
        await this.productRepo.delete(ids);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_js_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_js_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(allergy_entity_js_1.Allergy)),
    __param(3, (0, typeorm_1.InjectRepository)(accessory_entity_js_1.Accessory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map