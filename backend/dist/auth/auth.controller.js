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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_js_1 = require("./auth.service.js");
const login_dto_js_1 = require("./dto/login.dto.js");
const customer_register_dto_js_1 = require("./dto/customer-register.dto.js");
const customer_login_dto_js_1 = require("./dto/customer-login.dto.js");
const jwt_auth_guard_js_1 = require("./guards/jwt-auth.guard.js");
const jwt_customer_guard_js_1 = require("./guards/jwt-customer.guard.js");
const current_user_decorator_js_1 = require("./decorators/current-user.decorator.js");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    authService;
    config;
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    login(dto, res) {
        return this.authService.login(dto, res);
    }
    async refresh(req, res) {
        const token = req.cookies?.['refresh_token'];
        if (!token)
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });
        const payload = this.authService.verifyRefreshCookie(token, this.config.getOrThrow('JWT_REFRESH_SECRET'));
        if (!payload)
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
        return this.authService.refresh(payload.sub, token, res);
    }
    logout(user, res) {
        return this.authService.logout(user.sub, res);
    }
    me(user) {
        return this.authService.me(user.sub);
    }
    customerRegister(dto) {
        return this.authService.customerRegister(dto);
    }
    customerLogin(dto, res) {
        return this.authService.customerLogin(dto, res);
    }
    async customerRefresh(req, res) {
        const token = req.cookies?.['customer_refresh_token'];
        if (!token)
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });
        const payload = this.authService.verifyRefreshCookie(token, this.config.getOrThrow('JWT_CUSTOMER_REFRESH_SECRET'));
        if (!payload)
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
        return this.authService.customerRefresh(payload.sub, token, res);
    }
    customerLogout(req, res) {
        return this.authService.customerLogout(req.user.sub, res);
    }
    customerMe(req) {
        return this.authService.customerMe(req.user.sub);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_js_1.LoginDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh user access token via cookie' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'User logout' }),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user' }),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('customer/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer registration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_register_dto_js_1.CustomerRegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerRegister", null);
__decorate([
    (0, common_1.Post)('customer/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Customer login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_login_dto_js_1.CustomerLoginDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerLogin", null);
__decorate([
    (0, common_1.Post)('customer/refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh customer access token via cookie' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerRefresh", null);
__decorate([
    (0, common_1.Post)('customer/logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(jwt_customer_guard_js_1.JwtCustomerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Customer logout' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerLogout", null);
__decorate([
    (0, common_1.Get)('customer/me'),
    (0, common_1.UseGuards)(jwt_customer_guard_js_1.JwtCustomerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current customer' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "customerMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map