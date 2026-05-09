import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppWebSocketGateway } from './websocket.gateway.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({
  imports: [JwtModule.register({}), forwardRef(() => OrdersModule)],
  providers: [AppWebSocketGateway],
  exports: [AppWebSocketGateway],
})
export class WebSocketModule {}
