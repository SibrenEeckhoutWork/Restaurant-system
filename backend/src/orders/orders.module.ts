import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { UsersModule } from '../users/users.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';
import { WebSocketModule } from '../websocket/websocket.module.js';
import { CustomersModule } from '../customers/customers.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderItemAccessory]),
    forwardRef(() => WebSocketModule),
    UsersModule,
    TenantsModule,
    ModuleConfigModule,
    CustomersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
