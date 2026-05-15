import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto.js';
import { CustomerRegisterDto } from './dto/customer-register.dto.js';
import { CustomerLoginDto } from './dto/customer-login.dto.js';
import type { JwtPayload } from './strategies/jwt-access.strategy.js';
import type { JwtCustomerPayload } from './strategies/jwt-customer.strategy.js';
import type { SuperAdminPayload } from './strategies/super-admin.strategy.js';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        accessToken: string;
    }>;
    logout(user: JwtPayload, res: Response): Promise<void>;
    me(user: JwtPayload): Promise<{
        id: string;
        tenantId: string | null;
        isSuperAdmin: boolean;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    superAdminLogin(dto: SuperAdminLoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    superAdminRefresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        accessToken: string;
    }>;
    superAdminMe(req: Request & {
        user: SuperAdminPayload;
    }): Promise<{
        id: string;
        tenantId: string | null;
        isSuperAdmin: boolean;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    superAdminLogout(req: Request & {
        user: SuperAdminPayload;
    }, res: Response): Promise<void>;
    customerRegister(dto: CustomerRegisterDto): Promise<{
        id: string;
        name: string;
        tenantId: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    customerLogin(dto: CustomerLoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    customerRefresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        accessToken: string;
    }>;
    customerLogout(req: Request & {
        user: JwtCustomerPayload;
    }, res: Response): Promise<void>;
    customerMe(req: Request & {
        user: JwtCustomerPayload;
    }): Promise<{
        id: string;
        name: string;
        tenantId: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
