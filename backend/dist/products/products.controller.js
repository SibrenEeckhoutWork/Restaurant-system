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
exports.ProductsController = exports.AllergiesController = exports.CategoriesController = exports.MenuController = void 0;
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
const current_tenant_id_decorator_js_1 = require("../auth/decorators/current-tenant-id.decorator.js");
const tenants_service_js_1 = require("../tenants/tenants.service.js");
let MenuController = class MenuController {
    service;
    tenantsService;
    constructor(service, tenantsService) {
        this.service = service;
        this.tenantsService = tenantsService;
    }
    async getMenu(tenantSlug) {
        const tenant = await this.tenantsService.findBySlug(tenantSlug);
        if (!tenant || !tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant not found');
        return this.service.findMenu(tenant.id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tenantSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getMenu", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('Menu'),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService,
        tenants_service_js_1.TenantsService])
], MenuController);
let CategoriesController = class CategoriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(tenantId) { return this.service.findAllCategories(tenantId); }
    findOne(id, tenantId) {
        return this.service.findCategoryById(id, tenantId);
    }
    create(dto, tenantId) {
        return this.service.createCategory(dto, tenantId);
    }
    update(id, dto, tenantId) {
        return this.service.updateCategory(id, dto, tenantId);
    }
    bulkDelete(body, tenantId) {
        return this.service.bulkRemoveCategories(body.ids, tenantId);
    }
    remove(id, tenantId) {
        return this.service.removeCategory(id, tenantId);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.get'),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_js_1.CreateCategoryDto, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_js_1.UpdateCategoryDto, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('categories.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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
    findAll(tenantId) { return this.service.findAllAllergies(tenantId); }
    findOne(id, tenantId) {
        return this.service.findAllergyById(id, tenantId);
    }
    create(dto, tenantId) {
        return this.service.createAllergy(dto, tenantId);
    }
    update(id, dto, tenantId) {
        return this.service.updateAllergy(id, dto, tenantId);
    }
    bulkDelete(body, tenantId) {
        return this.service.bulkRemoveAllergies(body.ids, tenantId);
    }
    remove(id, tenantId) {
        return this.service.removeAllergy(id, tenantId);
    }
};
exports.AllergiesController = AllergiesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.get'),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_allergy_dto_js_1.CreateAllergyDto, String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_allergy_dto_js_1.UpdateAllergyDto, String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('allergies.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AllergiesController.prototype, "remove", null);
exports.AllergiesController = AllergiesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, swagger_1.ApiTags)('Allergies'),
    (0, common_1.Controller)('allergies'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], AllergiesController);
let ProductsController = class ProductsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(tenantId) { return this.service.findAllProducts(tenantId); }
    findOne(id, tenantId) {
        return this.service.findProductById(id, tenantId);
    }
    create(dto, tenantId) {
        return this.service.createProduct(dto, tenantId);
    }
    update(id, dto, tenantId) {
        return this.service.updateProduct(id, dto, tenantId);
    }
    bulkDelete(body, tenantId) {
        return this.service.bulkRemoveProducts(body.ids, tenantId);
    }
    remove(id, tenantId) {
        return this.service.removeProduct(id, tenantId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('products.get'),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('products.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('products.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_js_1.CreateProductDto, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('products.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_js_1.UpdateProductDto, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('products.delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('products.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map