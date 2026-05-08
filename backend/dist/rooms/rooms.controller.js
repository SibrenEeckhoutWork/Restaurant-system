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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_js_1 = require("./rooms.service.js");
const create_room_dto_js_1 = require("./dto/create-room.dto.js");
const update_room_dto_js_1 = require("./dto/update-room.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    findAll() {
        return this.roomsService.findAll();
    }
    findOne(id) {
        return this.roomsService.findById(id);
    }
    create(dto) {
        return this.roomsService.create(dto);
    }
    update(id, dto) {
        return this.roomsService.update(id, dto);
    }
    remove(id) {
        return this.roomsService.remove(id);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('rooms.get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('rooms.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('rooms.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_js_1.CreateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('rooms.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_js_1.UpdateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('rooms.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "remove", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('Rooms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_js_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map