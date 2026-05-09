import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationSlot } from './reservation-slot.entity.js';
import { Reservation } from './reservation.entity.js';
import { ReservationsService } from './reservations.service.js';
import { ReservationsController } from './reservations.controller.js';
import { Room } from '../rooms/room.entity.js';
import { Customer } from '../customers/customer.entity.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationSlot, Reservation, Room, Customer]),
    UsersModule,
    ModuleConfigModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
