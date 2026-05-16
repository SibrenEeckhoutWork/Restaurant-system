import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';
import { TenantsService } from '../tenants/tenants.service.js';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly tenantsService: TenantsService,
  ) {}

  @Post('public')
  @HttpCode(HttpStatus.CREATED)
  async createPublic(@Body() dto: CreateContactMessageDto) {
    const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    return this.contactService.create(dto, tenant.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('contact.read')
  findAll(@CurrentTenantId() tenantId: string) {
    return this.contactService.findAll(tenantId);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('contact.update')
  markRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.markRead(id);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('contact.delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.contactService.bulkRemove(body.ids);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('contact.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.remove(id);
  }
}
