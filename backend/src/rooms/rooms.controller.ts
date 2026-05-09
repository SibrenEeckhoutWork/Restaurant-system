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

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @RequirePermission('rooms.get')
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @RequirePermission('rooms.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.findById(id);
  }

  @Post()
  @RequirePermission('rooms.create')
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(':id')
  @RequirePermission('rooms.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('rooms.delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.roomsService.bulkRemove(body.ids);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('rooms.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.remove(id);
  }
}
