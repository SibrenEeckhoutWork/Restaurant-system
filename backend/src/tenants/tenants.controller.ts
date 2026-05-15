import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard.js';
import { ModuleConfigService } from '../module-config/module-config.service.js';

@Controller('tenants')
@UseGuards(SuperAdminGuard)
export class TenantsController {
  constructor(
    private readonly svc: TenantsService,
    private readonly moduleConfigSvc: ModuleConfigService,
  ) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Get('count')
  count() { return this.svc.count(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post()
  create(@Body() dto: CreateTenantDto) { return this.svc.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }

  @Get(':id/modules')
  getModules(@Param('id') id: string) {
    return this.moduleConfigSvc.getAll(id);
  }

  @Patch(':id/modules/:permission')
  setModule(
    @Param('id') id: string,
    @Param('permission') permission: string,
    @Body() body: { required: boolean },
  ) {
    return this.moduleConfigSvc.setRequired(permission, body.required, id);
  }
}
