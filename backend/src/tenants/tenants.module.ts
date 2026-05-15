import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity.js';
import { TenantsService } from './tenants.service.js';
import { TenantsController } from './tenants.controller.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), ModuleConfigModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
