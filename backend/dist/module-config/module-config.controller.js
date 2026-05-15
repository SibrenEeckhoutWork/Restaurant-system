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
exports.ModuleConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const module_config_service_js_1 = require("./module-config.service.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const current_tenant_id_decorator_js_1 = require("../auth/decorators/current-tenant-id.decorator.js");
let ModuleConfigController = class ModuleConfigController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll(tenantId) {
        return this.service.getAll(tenantId);
    }
    update(permission, body, tenantId) {
        return this.service.setRequired(permission, body.required, tenantId);
    }
};
exports.ModuleConfigController = ModuleConfigController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModuleConfigController.prototype, "getAll", null);
__decorate([
    (0, common_1.Patch)(':permission'),
    __param(0, (0, common_1.Param)('permission')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_id_decorator_js_1.CurrentTenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ModuleConfigController.prototype, "update", null);
exports.ModuleConfigController = ModuleConfigController = __decorate([
    (0, swagger_1.ApiTags)('ModuleConfig'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, common_1.Controller)('module-config'),
    __metadata("design:paramtypes", [module_config_service_js_1.ModuleConfigService])
], ModuleConfigController);
//# sourceMappingURL=module-config.controller.js.map