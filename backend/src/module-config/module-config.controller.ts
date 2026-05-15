import { Body, Controller, ForbiddenException, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ModuleConfigService } from './module-config.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';
import type { JwtPayload } from '../auth/strategies/jwt-access.strategy.js';

@ApiTags('ModuleConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('module-config')
export class ModuleConfigController {
  constructor(
    private readonly service: ModuleConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAll(@CurrentTenantId() tenantId: string) {
    return this.service.getAll(tenantId);
  }

  @Patch(':permission')
  async update(
    @Param('permission') permission: string,
    @Body() body: { required: boolean },
    @CurrentTenantId() tenantId: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user?.permissions.includes('permissions.manage')) throw new ForbiddenException();
    if (!user.permissions.includes(permission)) throw new ForbiddenException();
    return this.service.setRequired(permission, body.required, tenantId);
  }
}
