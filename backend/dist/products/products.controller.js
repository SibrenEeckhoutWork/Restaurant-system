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
exports.ProductsController = exports.AllergiesController = exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_js_1 = require("./products.service.js");
const create_product_dto_js_1 = require("./dto/create-product.dto.js");
const update_product_dto_js_1 = require("./dto/update-product.dto.js");
const create_category_dto_js_1 = require("./dto/create-category.dto.js");
const update_category_dto_js_1 = require("./dto/update-category.dto.js");
const create_allergy_dto_js_1 = require("./dto/create-allergy.dto.js");
const update_allergy_dto_js_1 = require("./dto/update-allergy.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
let CategoriesController = class CategoriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAllCategories(); }
    findOne(id) { return this.service.findCategoryById(id); }
    create(dto) { return this.service.createCategory(dto); }
    update(id, dto) {
        return this.service.updateCategory(id, dto);
    }
    bulkDelete(body) { return this.service.bulkRemoveCategories(body.ids); }
    remove(id) { return this.service.removeCategory(id); }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_js_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_js_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], CategoriesController);
let AllergiesController = class AllergiesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAllAllergies(); }
    findOne(id) { return this.service.findAllergyById(id); }
    create(dto) { return this.service.createAllergy(dto); }
    update(id, dto) {
        return this.service.updateAllergy(id, dto);
    }
    bulkDelete(body) { return this.service.bulkRemoveAllergies(body.ids); }
    remove(id) { return this.service.removeAllergy(id); }
};
exports.AllergiesController = AllergiesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_allergy_dto_js_1.CreateAllergyDto]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_allergy_dto_js_1.UpdateAllergyDto]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "remove", null);
exports.AllergiesController = AllergiesController = __decorate([
    (0, swagger_1.ApiTags)('Allergies'),
    (0, common_1.Controller)('allergies'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], AllergiesController);
let ProductsController = class ProductsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAllProducts(); }
    findOne(id) { return this.service.findProductById(id); }
    create(dto) { return this.service.createProduct(dto); }
    update(id, dto) {
        return this.service.updateProduct(id, dto);
    }
    bulkDelete(body) { return this.service.bulkRemoveProducts(body.ids); }
    remove(id) { return this.service.removeProduct(id); }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('products.get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('products.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('products.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_js_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('products.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_js_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('products.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('products.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map