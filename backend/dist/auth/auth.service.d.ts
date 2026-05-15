import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service.js';
import { CustomersService } from '../customers/customers.service.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto.js';
import { CustomerLoginDto } from './dto/customer-login.dto.js';
import { CustomerRegisterDto } from './dto/customer-register.dto.js';
export declare class AuthService {
    private readonly usersService;
    private readonly customersService;
    private readonly tenantsService;
    private readonly jwtService;
    private readonly config;
    constructor(usersService: UsersService, customersService: CustomersService, tenantsService: TenantsService, jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(userId: string, incomingToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(userId: string, res: Response): Promise<void>;
    me(userId: string): Promise<{
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
    private issueUserTokens;
    superAdminLogin(dto: SuperAdminLoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    superAdminRefresh(userId: string, incomingToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
    superAdminMe(userId: string): Promise<{
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
    superAdminLogout(userId: string, res: Response): Promise<void>;
    private issueSuperAdminTokens;
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
    customerRefresh(customerId: string, incomingToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
    customerLogout(customerId: string, res: Response): Promise<void>;
    customerMe(customerId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private issueCustomerTokens;
    verifyRefreshCookie(cookieValue: string, secret: string): {
        sub: string;
    } | null;
}
