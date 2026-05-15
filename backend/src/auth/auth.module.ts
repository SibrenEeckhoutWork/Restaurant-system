import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module.js';
import { CustomersModule } from '../customers/customers.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy.js';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy.js';
import { JwtCustomerStrategy } from './strategies/jwt-customer.strategy.js';
import { SuperAdminStrategy } from './strategies/super-admin.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { JwtCustomerGuard } from './guards/jwt-customer.guard.js';
import { SuperAdminGuard } from './guards/super-admin.guard.js';
import { PermissionGuard } from './guards/permission.guard.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    CustomersModule,
    TenantsModule,
    ModuleConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtCustomerStrategy,
    SuperAdminStrategy,
    JwtAuthGuard,
    JwtCustomerGuard,
    SuperAdminGuard,
    PermissionGuard,
  ],
  exports: [AuthService, JwtAuthGuard, JwtCustomerGuard, SuperAdminGuard, PermissionGuard],
})
export class AuthModule {}
