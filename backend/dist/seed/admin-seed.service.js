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
var AdminSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeedService = void 0;
const common_1 = require("@nestjs/common");
const users_service_js_1 = require("../users/users.service.js");
const config_1 = require("@nestjs/config");
const permissions_js_1 = require("../common/permissions.js");
let AdminSeedService = AdminSeedService_1 = class AdminSeedService {
    usersService;
    config;
    logger = new common_1.Logger(AdminSeedService_1.name);
    constructor(usersService, config) {
        this.usersService = usersService;
        this.config = config;
    }
    async onApplicationBootstrap() {
        const email = this.config.getOrThrow('ADMIN_EMAIL');
        const existing = await this.usersService.findByEmail(email);
        if (!existing) {
            const password = this.config.getOrThrow('ADMIN_PASSWORD');
            await this.usersService.create({ email, password, firstName: 'Admin', lastName: 'User', permissions: permissions_js_1.ALL_PERMISSIONS });
            this.logger.log(`Admin user seeded: ${email}`);
            return;
        }
        const missing = permissions_js_1.ALL_PERMISSIONS.filter((p) => !existing.permissions.includes(p));
        if (missing.length > 0) {
            await this.usersService.update(existing.id, { permissions: permissions_js_1.ALL_PERMISSIONS });
            this.logger.log(`Admin permissions synced (added: ${missing.join(', ')})`);
        }
    }
};
exports.AdminSeedService = AdminSeedService;
exports.AdminSeedService = AdminSeedService = AdminSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_js_1.UsersService,
        config_1.ConfigService])
], AdminSeedService);
//# sourceMappingURL=admin-seed.service.js.map