import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationStatus } from './reservation.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { JwtCustomerGuard } from '../auth/guards/jwt-customer.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';
import { TenantsService } from '../tenants/tenants.service.js';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly service: ReservationsService,
    private readonly tenantsService: TenantsService,
  ) {}

  // ── Public ───────────────────────────────────────────────────────────────

  @Get('availability')
  async getAvailability(
    @Query('tenantSlug') tenantSlug: string,
    @Query('date') date: string,
    @Query('partySize', ParseIntPipe) partySize: number,
  ) {
    const tenant = await this.tenantsService.findBySlug(tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    return this.service.getAvailability(date, partySize, tenant.id);
  }

  @Get('available-dates')
  async getAvailableDates(
    @Query('tenantSlug') tenantSlug: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('partySize', ParseIntPipe) partySize: number,
  ) {
    const tenant = await this.tenantsService.findBySlug(tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    return this.service.getAvailableDatesForMonth(year, month, partySize, tenant.id);
  }

  @Post('public')
  async createPublic(@Body() dto: CreatePublicReservationDto) {
    const tenant = await this.tenantsService.findBySlug(dto.tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    return this.service.createPublicReservation(dto, tenant.id);
  }

  // ── Slots (backoffice) ───────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('slots')
  @RequirePermission('reservations.get')
  findSlots(@CurrentTenantId() tenantId: string, @Query('date') date?: string) {
    return this.service.findSlots(tenantId, { date });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('slots')
  @RequirePermission('reservations.create')
  createSlot(@Body() dto: CreateSlotDto, @CurrentTenantId() tenantId: string) {
    return this.service.createSlot(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch('slots/:id')
  @RequirePermission('reservations.update')
  updateSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSlotDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.service.updateSlot(id, dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('slots/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('reservations.delete')
  removeSlot(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.removeSlot(id, tenantId);
  }

  // ── Reservations (backoffice) ─────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  @RequirePermission('reservations.get')
  findAll(
    @CurrentTenantId() tenantId: string,
    @Query('date') date?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: ReservationStatus,
  ) {
    return this.service.findAll(tenantId, { date, fromDate, toDate, status });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('admin')
  @RequirePermission('reservations.create')
  createAdmin(@Body() dto: CreateReservationDto, @CurrentTenantId() tenantId: string) {
    return this.service.createReservation(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  @RequirePermission('reservations.get')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.findById(id, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id/status')
  @RequirePermission('reservations.update')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.service.updateStatus(id, dto, tenantId);
  }

  // ── Customer routes ───────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtCustomerGuard)
  @Post()
  createForCustomer(@Body() dto: CreateReservationDto, @CurrentTenantId() tenantId: string) {
    return this.service.createReservation(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('reservations.delete')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.service.bulkRemove(body.ids, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtCustomerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeForCustomer(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.remove(id, tenantId);
  }
}
