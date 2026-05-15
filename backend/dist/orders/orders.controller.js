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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_js_1 = require("./orders.service.js");
const create_order_dto_js_1 = require("./dto/create-order.dto.js");
const update_order_status_dto_js_1 = require("./dto/update-order-status.dto.js");
const update_order_items_dto_js_1 = require("./dto/update-order-items.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
const current_tenant_id_decorator_js_1 = require("../auth/decorators/current-tenant-id.decorator.js");
const tenants_service_js_1 = require("../tenants/tenants.service.js");
const websocket_gateway_js_1 = require("../websocket/websocket.gateway.js");
let OrdersController = class OrdersController {
    service;
    tenantsService;
    gateway;
    constructor(service, tenantsService, gateway) {
        this.service = service;
        this.tenantsService = tenantsService;
        this.gateway = gateway;
    }
    findAll(tenantId) { return this.service.findAll(tenantId); }
    findOne(id, tenantId) {
        return this.service.findById(id, tenantId);
    }
    async create(dto) {
        const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
        if (!tenant || !tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant not found');
        const order = await this.service.create(dto, tenant.id);
        this.gateway.emitToRoom('kitchen', 'order:new', order);
        return order;
    }
    async updateStatus(id, dto, tenantId) {
        const order = await this.service.updateStatus(id, dto, tenantId);
        this.gateway.emitToRoom('kitchen', 'order:updated', order);
        return order;
    }
    updateItems(id, dto, tenantId) {
        return this.service.updateItems(id, dto, tenantId);
    }
    bulkDelete(body, tenantId) {
        return this.service.bulkRemove(body.ids, tenantId);
    }
    remove(id, tenantId) {
        return this.service.remove(id, tenantId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.read'),
    (0, common_1.Get)(),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.read'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_js_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.update'),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_js_1.UpdateOrderStatusDto, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.update'),
    (0, common_1.Patch)(':id/items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_items_dto_js_1.UpdateOrderItemsDto, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateItems", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.delete'),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "bulkDelete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.delete'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => websocket_gateway_js_1.AppWebSocketGateway))),
    __metadata("design:paramtypes", [orders_service_js_1.OrdersService,
        tenants_service_js_1.TenantsService,
        websocket_gateway_js_1.AppWebSocketGateway])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map