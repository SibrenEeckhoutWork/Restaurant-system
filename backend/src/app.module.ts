import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { AuthModule } from './auth/auth.module.js';
import { WebhookModule } from './webhook/webhook.module.js';
import { WebSocketModule } from './websocket/websocket.module.js';
import { AdminSeedService } from './seed/admin-seed.service.js';
import { ModuleConfigModule } from './module-config/module-config.module.js';
import { RoomsModule } from './rooms/rooms.module.js';
import { TablesModule } from './tables/tables.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    UsersModule,
    CustomersModule,
    AuthModule,
    WebhookModule,
    WebSocketModule,
    ModuleConfigModule,
    RoomsModule,
    TablesModule,
    ReservationsModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeedService],
})
export class AppModule {}
