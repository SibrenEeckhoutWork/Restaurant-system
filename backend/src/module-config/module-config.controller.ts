import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModuleConfigService } from './module-config.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';

@ApiTags('ModuleConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('module-config')
export class ModuleConfigController {
  constructor(private readonly service: ModuleConfigService) {}

  @Get()
  getAll(@CurrentTenantId() tenantId: string) {
    return this.service.getAll(tenantId);
  }

  @Patch(':permission')
  update(
    @Param('permission') permission: string,
    @Body() body: { required: boolean },
    @CurrentTenantId() tenantId: string,
  ) {
    return this.service.setRequired(permission, body.required, tenantId);
  }
}
