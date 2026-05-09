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
exports.TablesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tables_service_js_1 = require("./tables.service.js");
const create_table_dto_js_1 = require("./dto/create-table.dto.js");
const update_table_dto_js_1 = require("./dto/update-table.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const permission_guard_js_1 = require("../auth/guards/permission.guard.js");
const require_permission_decorator_js_1 = require("../auth/decorators/require-permission.decorator.js");
let TablesController = class TablesController {
    tablesService;
    constructor(tablesService) {
        this.tablesService = tablesService;
    }
    findAll(roomId) {
        return this.tablesService.findAll(roomId);
    }
    findOne(id) {
        return this.tablesService.findById(id);
    }
    create(dto) {
        return this.tablesService.create(dto);
    }
    update(id, dto) {
        return this.tablesService.update(id, dto);
    }
    bulkDelete(body) {
        return this.tablesService.bulkRemove(body.ids);
    }
    remove(id) {
        return this.tablesService.remove(id);
    }
};
exports.TablesController = TablesController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.get'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.get'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_js_1.CreateTableDto]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_dto_js_1.UpdateTableDto]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, require_permission_decorator_js_1.RequirePermission)('tables.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "remove", null);
exports.TablesController = TablesController = __decorate([
    (0, swagger_1.ApiTags)('Tables'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, permission_guard_js_1.PermissionGuard),
    (0, common_1.Controller)('tables'),
    __metadata("design:paramtypes", [tables_service_js_1.TablesService])
], TablesController);
//# sourceMappingURL=tables.controller.js.map