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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @RequirePermission('rooms.get')
  findAll(@CurrentTenantId() tenantId: string) {
    return this.roomsService.findAll(tenantId);
  }

  @Get(':id')
  @RequirePermission('rooms.get')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.roomsService.findById(id, tenantId);
  }

  @Post()
  @RequirePermission('rooms.create')
  create(@Body() dto: CreateRoomDto, @CurrentTenantId() tenantId: string) {
    return this.roomsService.create(dto, tenantId);
  }

  @Patch(':id')
  @RequirePermission('rooms.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoomDto, @CurrentTenantId() tenantId: string) {
    return this.roomsService.update(id, dto, tenantId);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('rooms.delete')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.roomsService.bulkRemove(body.ids, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('rooms.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.roomsService.remove(id, tenantId);
  }
}
