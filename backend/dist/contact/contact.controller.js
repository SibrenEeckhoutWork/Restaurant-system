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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contact_service_js_1 = require("./contact.service.js");
const create_contact_message_dto_js_1 = require("./dto/create-contact-message.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
const current_tenant_id_decorator_js_1 = require("../auth/decorators/current-tenant-id.decorator.js");
const tenants_service_js_1 = require("../tenants/tenants.service.js");
let ContactController = class ContactController {
    contactService;
    tenantsService;
    constructor(contactService, tenantsService) {
        this.contactService = contactService;
        this.tenantsService = tenantsService;
    }
    async createPublic(dto) {
        const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
        if (!tenant || !tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant not found');
        return this.contactService.create(dto, tenant.id);
    }
    findAll(tenantId) {
        return this.contactService.findAll(tenantId);
    }
    markRead(id) {
        return this.contactService.markRead(id);
    }
    bulkDelete(body) {
        return this.contactService.bulkRemove(body.ids);
    }
    remove(id) {
        return this.contactService.remove(id);
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)('public'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_message_dto_js_1.CreateContactMessageDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "createPublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('contact.read'),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('contact.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "markRead", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('contact.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('contact.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "remove", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('Contact'),
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_js_1.ContactService,
        tenants_service_js_1.TenantsService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map