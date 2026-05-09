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
let OrdersController = class OrdersController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    findOne(id) { return this.service.findById(id); }
    create(dto) { return this.service.create(dto); }
    updateStatus(id, dto) {
        return this.service.updateStatus(id, dto);
    }
    updateItems(id, dto) {
        return this.service.updateItems(id, dto);
    }
    bulkDelete(body) { return this.service.bulkRemove(body.ids); }
    remove(id) { return this.service.remove(id); }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_js_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_js_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/items'),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_items_dto_js_1.UpdateOrderItemsDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateItems", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('orders.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_js_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map