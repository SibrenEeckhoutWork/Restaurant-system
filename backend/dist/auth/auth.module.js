"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const users_module_js_1 = require("../users/users.module.js");
const customers_module_js_1 = require("../customers/customers.module.js");
const tenants_module_js_1 = require("../tenants/tenants.module.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
const auth_service_js_1 = require("./auth.service.js");
const auth_controller_js_1 = require("./auth.controller.js");
const jwt_access_strategy_js_1 = require("./strategies/jwt-access.strategy.js");
const jwt_refresh_strategy_js_1 = require("./strategies/jwt-refresh.strategy.js");
const jwt_customer_strategy_js_1 = require("./strategies/jwt-customer.strategy.js");
const super_admin_strategy_js_1 = require("./strategies/super-admin.strategy.js");
const jwt_auth_guard_js_1 = require("./guards/jwt-auth.guard.js");
const jwt_customer_guard_js_1 = require("./guards/jwt-customer.guard.js");
const super_admin_guard_js_1 = require("./guards/super-admin.guard.js");
const permission_guard_js_1 = require("./guards/permission.guard.js");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
            users_module_js_1.UsersModule,
            customers_module_js_1.CustomersModule,
            tenants_module_js_1.TenantsModule,
            module_config_module_js_1.ModuleConfigModule,
        ],
        controllers: [auth_controller_js_1.AuthController],
        providers: [
            auth_service_js_1.AuthService,
            jwt_access_strategy_js_1.JwtAccessStrategy,
            jwt_refresh_strategy_js_1.JwtRefreshStrategy,
            jwt_customer_strategy_js_1.JwtCustomerStrategy,
            super_admin_strategy_js_1.SuperAdminStrategy,
            jwt_auth_guard_js_1.JwtAuthGuard,
            jwt_customer_guard_js_1.JwtCustomerGuard,
            super_admin_guard_js_1.SuperAdminGuard,
            permission_guard_js_1.PermissionGuard,
        ],
        exports: [auth_service_js_1.AuthService, jwt_auth_guard_js_1.JwtAuthGuard, jwt_customer_guard_js_1.JwtCustomerGuard, super_admin_guard_js_1.SuperAdminGuard, permission_guard_js_1.PermissionGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map