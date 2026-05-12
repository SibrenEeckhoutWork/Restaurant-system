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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reservations_service_js_1 = require("./reservations.service.js");
const create_slot_dto_js_1 = require("./dto/create-slot.dto.js");
const update_slot_dto_js_1 = require("./dto/update-slot.dto.js");
const create_reservation_dto_js_1 = require("./dto/create-reservation.dto.js");
const create_public_reservation_dto_js_1 = require("./dto/create-public-reservation.dto.js");
const update_reservation_status_dto_js_1 = require("./dto/update-reservation-status.dto.js");
const reservation_entity_js_1 = require("./reservation.entity.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const jwt_customer_guard_js_1 = require("../auth/guards/jwt-customer.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
let ReservationsController = class ReservationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAvailability(date, partySize) {
        return this.service.getAvailability(date, partySize);
    }
    getAvailableDates(year, month, partySize) {
        return this.service.getAvailableDatesForMonth(year, month, partySize);
    }
    findSlots(date) {
        return this.service.findSlots({ date });
    }
    createSlot(dto) {
        return this.service.createSlot(dto);
    }
    updateSlot(id, dto) {
        return this.service.updateSlot(id, dto);
    }
    removeSlot(id) {
        return this.service.removeSlot(id);
    }
    findAll(date, fromDate, toDate, status) {
        return this.service.findAll({ date, fromDate, toDate, status });
    }
    createAdmin(dto) {
        return this.service.createReservation(dto);
    }
    findOne(id) {
        return this.service.findById(id);
    }
    updateStatus(id, dto) {
        return this.service.updateStatus(id, dto);
    }
    createPublic(dto) {
        return this.service.createPublicReservation(dto);
    }
    createForCustomer(dto) {
        return this.service.createReservation(dto);
    }
    bulkDelete(body) {
        return this.service.bulkRemove(body.ids);
    }
    removeForCustomer(id) {
        return this.service.remove(id);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Get)('availability'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('partySize', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('available-dates'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('month', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('partySize', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "getAvailableDates", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Get)('slots'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.get'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findSlots", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Post)('slots'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slot_dto_js_1.CreateSlotDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "createSlot", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Patch)('slots/:id'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_slot_dto_js_1.UpdateSlotDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "updateSlot", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Delete)('slots/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "removeSlot", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.get'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Post)('admin'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_js_1.CreateReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Patch)(':id/status'),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reservation_status_dto_js_1.UpdateReservationStatusDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('public'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_public_reservation_dto_js_1.CreatePublicReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "createPublic", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_customer_guard_js_1.JwtCustomerGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_js_1.CreateReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "createForCustomer", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('reservations.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "bulkDelete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_customer_guard_js_1.JwtCustomerGuard),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "removeForCustomer", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('Reservations'),
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservations_service_js_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map