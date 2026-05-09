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
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  @RequirePermission('orders.read')
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @RequirePermission('orders.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findById(id); }

  @Post()
  @RequirePermission('orders.create')
  create(@Body() dto: CreateOrderDto) { return this.service.create(dto); }

  @Patch(':id/status')
  @RequirePermission('orders.update')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Patch(':id/items')
  @RequirePermission('orders.update')
  updateItems(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderItemsDto) {
    return this.service.updateItems(id, dto);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  bulkDelete(@Body() body: { ids: string[] }) { return this.service.bulkRemove(body.ids); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
