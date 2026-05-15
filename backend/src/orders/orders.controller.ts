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
  UnauthorizedException,
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
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { AppWebSocketGateway } from '../websocket/websocket.gateway.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly service: OrdersService,
    private readonly tenantsService: TenantsService,
    @Inject(forwardRef(() => AppWebSocketGateway)) private readonly gateway: AppWebSocketGateway,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.read')
  @Get()
  findAll(@CurrentTenantId() tenantId: string) { return this.service.findAll(tenantId); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.read')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.findById(id, tenantId);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    const order = await this.service.create(dto, tenant.id);
    this.gateway.emitToRoom('kitchen', 'order:new', order);
    return order;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.update')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentTenantId() tenantId: string,
  ) {
    const order = await this.service.updateStatus(id, dto, tenantId);
    this.gateway.emitToRoom('kitchen', 'order:updated', order);
    return order;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('orders.update')
  @Patch(':id/items')
  updateItems(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderItemsDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.service.updateItems(id, dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  @Delete('bulk')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.service.bulkRemove(body.ids, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('orders.delete')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.remove(id, tenantId);
  }
}
