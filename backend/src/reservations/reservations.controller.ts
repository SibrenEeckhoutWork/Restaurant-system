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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { UpdateSlotDto } from './dto/update-slot.dto.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationStatus } from './reservation.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { JwtCustomerGuard } from '../auth/guards/jwt-customer.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  // ── Public ───────────────────────────────────────────────────────────────

  @Get('availability')
  getAvailability(
    @Query('date') date: string,
    @Query('partySize', ParseIntPipe) partySize: number,
  ) {
    return this.service.getAvailability(date, partySize);
  }

  // ── Slots (backoffice) ───────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('slots')
  @RequirePermission('reservations.get')
  findSlots(@Query('date') date?: string) {
    return this.service.findSlots({ date });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('slots')
  @RequirePermission('reservations.create')
  createSlot(@Body() dto: CreateSlotDto) {
    return this.service.createSlot(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch('slots/:id')
  @RequirePermission('reservations.update')
  updateSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSlotDto,
  ) {
    return this.service.updateSlot(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('slots/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('reservations.delete')
  removeSlot(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeSlot(id);
  }

  // ── Reservations (backoffice) ─────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  @RequirePermission('reservations.get')
  findAll(
    @Query('date') date?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: ReservationStatus,
  ) {
    return this.service.findAll({ date, fromDate, toDate, status });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('admin')
  @RequirePermission('reservations.create')
  createAdmin(@Body() dto: CreateReservationDto) {
    return this.service.createReservation(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  @RequirePermission('reservations.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id/status')
  @RequirePermission('reservations.update')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

  // ── Customer routes ───────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtCustomerGuard)
  @Post()
  createForCustomer(@Body() dto: CreateReservationDto) {
    return this.service.createReservation(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtCustomerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeForCustomer(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
