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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TablesService } from './tables.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';

@ApiTags('Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @RequirePermission('tables.get')
  findAll(@Query('roomId') roomId?: string) {
    return this.tablesService.findAll(roomId);
  }

  @Get(':id')
  @RequirePermission('tables.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.findById(id);
  }

  @Post()
  @RequirePermission('tables.create')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Patch(':id')
  @RequirePermission('tables.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTableDto) {
    return this.tablesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('tables.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.remove(id);
  }
}
