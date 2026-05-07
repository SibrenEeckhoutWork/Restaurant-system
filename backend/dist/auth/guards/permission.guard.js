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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const users_service_js_1 = require("../../users/users.service.js");
const module_config_service_js_1 = require("../../module-config/module-config.service.js");
let PermissionGuard = class PermissionGuard {
    reflector;
    usersService;
    moduleConfigService;
    constructor(reflector, usersService, moduleConfigService) {
        this.reflector = reflector;
        this.usersService = usersService;
        this.moduleConfigService = moduleConfigService;
    }
    async canActivate(context) {
        const required = this.reflector.getAllAndOverride('permission', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required)
            return true;
        const isRequired = await this.moduleConfigService.isRequired(required);
        if (!isRequired)
            return true;
        const { user } = context.switchToHttp().getRequest();
        const dbUser = await this.usersService.findById(user.sub);
        if (!dbUser?.permissions.includes(required))
            throw new common_1.ForbiddenException();
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        users_service_js_1.UsersService,
        module_config_service_js_1.ModuleConfigService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map