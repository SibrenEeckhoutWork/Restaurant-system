import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity.js';
import { RoomsService } from './rooms.service.js';
import { RoomsController } from './rooms.controller.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UsersModule, ModuleConfigModule],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
