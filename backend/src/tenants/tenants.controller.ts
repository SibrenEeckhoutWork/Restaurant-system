import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException,
} from '@nestjs/common';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard.js';
import { ModuleConfigService } from '../module-config/module-config.service.js';
import { UsersService } from '../users/users.service.js';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly svc: TenantsService,
    private readonly moduleConfigSvc: ModuleConfigService,
    private readonly usersSvc: UsersService,
  ) {}

  @Get('public/by-slug/:slug')
  async getPublicBySlug(@Param('slug') slug: string) {
    const t = await this.svc.findBySlug(slug);
    if (!t) throw new NotFoundException('Tenant not found');
    return { id: t.id, name: t.name, slug: t.slug, isActive: t.isActive };
  }

  @Get('public/by-id/:id')
  async getPublicById(@Param('id') id: string) {
    const t = await this.svc.findById(id).catch(() => null);
    if (!t) throw new NotFoundException('Tenant not found');
    return { id: t.id, name: t.name, slug: t.slug, isActive: t.isActive };
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  findAll() { return this.svc.findAll(); }

  @Get('count')
  @UseGuards(SuperAdminGuard)
  count() { return this.svc.count(); }

  @Get(':id')
  @UseGuards(SuperAdminGuard)
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post()
  @UseGuards(SuperAdminGuard)
  async create(@Body() dto: CreateTenantDto) {
    const { adminEmail, adminPassword, ...tenantData } = dto;
    const tenant = await this.svc.create(tenantData);

    let adminUser = null;
    if (adminEmail && adminPassword) {
      const user = await this.usersSvc.create({
        email: adminEmail,
        password: adminPassword,
        permissions: [],
        tenantId: tenant.id,
      });
      const { password, refreshTokenHash, ...safeUser } = user;
      void password; void refreshTokenHash;
      adminUser = safeUser;
    }

    return { tenant, adminUser };
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  remove(@Param('id') id: string) { return this.svc.remove(id); }

  @Get(':id/modules')
  @UseGuards(SuperAdminGuard)
  getModules(@Param('id') id: string) {
    return this.moduleConfigSvc.getAll(id);
  }

  @Patch(':id/modules/:permission')
  @UseGuards(SuperAdminGuard)
  setModule(
    @Param('id') id: string,
    @Param('permission') permission: string,
    @Body() body: { required: boolean },
  ) {
    return this.moduleConfigSvc.setRequired(permission, body.required, id);
  }
}
