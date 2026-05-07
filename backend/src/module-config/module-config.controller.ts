import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModuleConfigService } from './module-config.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('ModuleConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('module-config')
export class ModuleConfigController {
  constructor(private readonly service: ModuleConfigService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Patch(':permission')
  update(
    @Param('permission') permission: string,
    @Body() body: { required: boolean },
  ) {
    return this.service.setRequired(permission, body.required);
  }
}
