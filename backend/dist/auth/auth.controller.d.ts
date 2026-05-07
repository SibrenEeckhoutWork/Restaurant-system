import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CustomerRegisterDto } from './dto/customer-register.dto.js';
import { CustomerLoginDto } from './dto/customer-login.dto.js';
import type { JwtPayload } from './strategies/jwt-access.strategy.js';
import type { JwtCustomerPayload } from './strategies/jwt-customer.strategy.js';
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
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    customerRegister(dto: CustomerRegisterDto): Promise<{
        id: string;
        name: string;
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
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
