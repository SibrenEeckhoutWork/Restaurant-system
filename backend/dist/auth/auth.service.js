"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const users_service_js_1 = require("../users/users.service.js");
const customers_service_js_1 = require("../customers/customers.service.js");
const tenants_service_js_1 = require("../tenants/tenants.service.js");
const REFRESH_COOKIE = 'refresh_token';
const SUPER_ADMIN_REFRESH_COOKIE = 'sa_refresh_token';
const CUSTOMER_REFRESH_COOKIE = 'customer_refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
let AuthService = class AuthService {
    usersService;
    customersService;
    tenantsService;
    jwtService;
    config;
    constructor(usersService, customersService, tenantsService, jwtService, config) {
        this.usersService = usersService;
        this.customersService = customersService;
        this.tenantsService = tenantsService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async login(dto, res) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || user.isSuperAdmin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Account disabled');
        if (!user.tenantId)
            throw new common_1.UnauthorizedException('Account not linked to a tenant');
        const tenant = await this.tenantsService.findById(user.tenantId).catch(() => null);
        if (!tenant)
            throw new common_1.UnauthorizedException('Tenant not found');
        if (!tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant inactive');
        return this.issueUserTokens(user, res);
    }
    async refresh(userId, incomingToken, res) {
        const user = await this.usersService.findById(userId);
        if (!user?.refreshTokenHash)
            throw new common_1.UnauthorizedException();
        const match = await bcrypt.compare(incomingToken, user.refreshTokenHash);
        if (!match)
            throw new common_1.UnauthorizedException();
        return this.issueUserTokens(user, res);
    }
    async logout(userId, res) {
        await this.usersService.updateRefreshToken(userId, null);
        res.clearCookie(REFRESH_COOKIE);
    }
    async me(userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const { password, refreshTokenHash, ...safe } = user;
        void password;
        void refreshTokenHash;
        return safe;
    }
    async issueUserTokens(user, res) {
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, type: 'user', tenantId: user.tenantId }, {
            secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
        });
        const refreshToken = this.jwtService.sign({ sub: user.id, type: 'refresh' }, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
        });
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(user.id, hash);
        const isProduction = this.config.get('NODE_ENV') === 'production';
        res.cookie(REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
        });
        return { accessToken };
    }
    async superAdminLogin(dto, res) {
        const user = await this.usersService.findSuperAdminByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueSuperAdminTokens(user, res);
    }
    async superAdminRefresh(userId, incomingToken, res) {
        const user = await this.usersService.findById(userId);
        if (!user?.refreshTokenHash || !user.isSuperAdmin)
            throw new common_1.UnauthorizedException();
        const match = await bcrypt.compare(incomingToken, user.refreshTokenHash);
        if (!match)
            throw new common_1.UnauthorizedException();
        return this.issueSuperAdminTokens(user, res);
    }
    async superAdminMe(userId) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.isSuperAdmin)
            throw new common_1.UnauthorizedException();
        const { password, refreshTokenHash, ...safe } = user;
        void password;
        void refreshTokenHash;
        return safe;
    }
    async superAdminLogout(userId, res) {
        await this.usersService.updateRefreshToken(userId, null);
        res.clearCookie(SUPER_ADMIN_REFRESH_COOKIE);
    }
    async issueSuperAdminTokens(user, res) {
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, type: 'super_admin' }, {
            secret: this.config.getOrThrow('SUPER_ADMIN_JWT_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
        });
        const refreshToken = this.jwtService.sign({ sub: user.id, type: 'sa-refresh' }, {
            secret: this.config.getOrThrow('SUPER_ADMIN_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
        });
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(user.id, hash);
        const isProduction = this.config.get('NODE_ENV') === 'production';
        res.cookie(SUPER_ADMIN_REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
        });
        return { accessToken };
    }
    async customerRegister(dto) {
        const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
        if (!tenant || !tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant not found or inactive');
        const existing = await this.customersService.findByEmailInTenant(dto.email, tenant.id);
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const customer = await this.customersService.create(dto, tenant.id);
        const { password, refreshTokenHash, ...safe } = customer;
        void password;
        void refreshTokenHash;
        return safe;
    }
    async customerLogin(dto, res) {
        const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
        if (!tenant || !tenant.isActive)
            throw new common_1.UnauthorizedException('Tenant not found or inactive');
        const customer = await this.customersService.findByEmailInTenant(dto.email, tenant.id);
        if (!customer)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, customer.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueCustomerTokens(customer, res);
    }
    async customerRefresh(customerId, incomingToken, res) {
        const customer = await this.customersService.findById(customerId);
        if (!customer?.refreshTokenHash)
            throw new common_1.UnauthorizedException();
        const match = await bcrypt.compare(incomingToken, customer.refreshTokenHash);
        if (!match)
            throw new common_1.UnauthorizedException();
        return this.issueCustomerTokens(customer, res);
    }
    async customerLogout(customerId, res) {
        await this.customersService.updateRefreshToken(customerId, null);
        res.clearCookie(CUSTOMER_REFRESH_COOKIE);
    }
    async customerMe(customerId) {
        const customer = await this.customersService.findById(customerId);
        if (!customer)
            throw new common_1.UnauthorizedException();
        const { password, refreshTokenHash, ...safe } = customer;
        void password;
        void refreshTokenHash;
        return safe;
    }
    async issueCustomerTokens(customer, res) {
        const accessToken = this.jwtService.sign({ sub: customer.id, email: customer.email, type: 'customer', tenantId: customer.tenantId }, {
            secret: this.config.getOrThrow('JWT_CUSTOMER_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
        });
        const refreshToken = this.jwtService.sign({ sub: customer.id, type: 'customer-refresh' }, {
            secret: this.config.getOrThrow('JWT_CUSTOMER_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
        });
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.customersService.updateRefreshToken(customer.id, hash);
        const isProduction = this.config.get('NODE_ENV') === 'production';
        res.cookie(CUSTOMER_REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
        });
        return { accessToken };
    }
    verifyRefreshCookie(cookieValue, secret) {
        try {
            return this.jwtService.verify(cookieValue, { secret });
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_js_1.UsersService,
        customers_service_js_1.CustomersService,
        tenants_service_js_1.TenantsService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map