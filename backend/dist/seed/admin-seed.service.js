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
const tenants_service_js_1 = require("../tenants/tenants.service.js");
const config_1 = require("@nestjs/config");
const permissions_js_1 = require("../common/permissions.js");
let AdminSeedService = AdminSeedService_1 = class AdminSeedService {
    usersService;
    tenantsService;
    config;
    logger = new common_1.Logger(AdminSeedService_1.name);
    constructor(usersService, tenantsService, config) {
        this.usersService = usersService;
        this.tenantsService = tenantsService;
        this.config = config;
    }
    async onApplicationBootstrap() {
        await this.seedSuperAdmin();
        await this.seedDefaultTenant();
    }
    async seedSuperAdmin() {
        const email = this.config.get('SUPER_ADMIN_EMAIL');
        if (!email)
            return;
        const existing = await this.usersService.findSuperAdminByEmail(email);
        if (!existing) {
            const password = this.config.getOrThrow('SUPER_ADMIN_PASSWORD');
            await this.usersService.create({
                email,
                password,
                firstName: 'Super',
                lastName: 'Admin',
                permissions: [],
                tenantId: null,
                isSuperAdmin: true,
            });
            this.logger.log(`Super admin seeded: ${email}`);
        }
    }
    async seedDefaultTenant() {
        const slug = this.config.get('DEFAULT_TENANT_SLUG');
        const name = this.config.get('DEFAULT_TENANT_NAME');
        const adminEmail = this.config.get('ADMIN_EMAIL');
        if (!slug || !name || !adminEmail)
            return;
        let tenant = await this.tenantsService.findBySlug(slug);
        if (!tenant) {
            tenant = await this.tenantsService.create({ name, slug });
            this.logger.log(`Default tenant seeded: ${slug}`);
        }
        const existing = await this.usersService.findByEmailInTenant(adminEmail, tenant.id);
        if (!existing) {
            const password = this.config.getOrThrow('ADMIN_PASSWORD');
            await this.usersService.create({
                email: adminEmail,
                password,
                firstName: 'Admin',
                lastName: 'User',
                permissions: permissions_js_1.ALL_PERMISSIONS,
                tenantId: tenant.id,
            });
            this.logger.log(`Default tenant admin seeded: ${adminEmail}`);
            return;
        }
        const missing = permissions_js_1.ALL_PERMISSIONS.filter((p) => !existing.permissions.includes(p));
        if (missing.length > 0) {
            await this.usersService.update(existing.id, { permissions: permissions_js_1.ALL_PERMISSIONS });
            this.logger.log(`Default tenant admin permissions synced (added: ${missing.join(', ')})`);
        }
    }
};
exports.AdminSeedService = AdminSeedService;
exports.AdminSeedService = AdminSeedService = AdminSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_js_1.UsersService,
        tenants_service_js_1.TenantsService,
        config_1.ConfigService])
], AdminSeedService);
//# sourceMappingURL=admin-seed.service.js.map