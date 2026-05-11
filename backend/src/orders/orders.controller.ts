import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { AppWebSocketGateway } from '../websocket/websocket.gateway.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly service: OrdersService,
    @Inject(forwardRef(() => AppWebSocketGateway)) private readonly gateway: AppWebSocketGateway,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.read')
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.read')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findById(id); }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.service.create(dto);
    this.gateway.emitToRoom('kitchen', 'order:new', order);
    return order;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.update')
  @Patch(':id/status')
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    const order = await this.service.updateStatus(id, dto);
    this.gateway.emitToRoom('kitchen', 'order:updated', order);
    return order;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.update')
  @Patch(':id/items')
  updateItems(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderItemsDto) {
    return this.service.updateItems(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  @Delete('bulk')
  bulkDelete(@Body() body: { ids: string[] }) { return this.service.bulkRemove(body.ids); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
