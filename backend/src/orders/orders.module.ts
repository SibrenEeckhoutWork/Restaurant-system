import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Accessory } from '../products/accessory.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Accessory]), UsersModule, ModuleConfigModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
