import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service.js';
import { OrderStatus } from '../orders/order.entity.js';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class AppWebSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(AppWebSocketGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {}

  handleConnection(client: Socket): void {
    const token =
      (client.handshake.auth as Record<string, string>)?.token ??
      (client.handshake.headers.authorization as string | undefined)?.replace('Bearer ', '');

    if (!token) {
      this.logger.warn(`WS rejected — no token (${client.id})`);
      client.disconnect();
      return;
    }

    const secrets = [
      this.config.getOrThrow('JWT_ACCESS_SECRET'),
      this.config.getOrThrow('JWT_CUSTOMER_ACCESS_SECRET'),
    ];

    const valid = secrets.some((secret) => {
      try {
        this.jwtService.verify(token, { secret });
        return true;
      } catch {
        return false;
      }
    });

    if (!valid) {
      this.logger.warn(`WS rejected — invalid token (${client.id})`);
      client.disconnect();
    }
  }

  emitToRoom(room: string, event: string, payload: object): void {
    this.server.to(room).emit(event, payload);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    void client.join(room);
  }

  @SubscribeMessage('item:status')
  async handleItemStatus(
    @MessageBody() data: { orderId: string; itemId: string; status: 'pending' | 'preparing' | 'ready' },
  ): Promise<void> {
    const order = await this.ordersService.updateItemStatus(data.orderId, data.itemId, data.status);
    this.emitToRoom('kitchen', 'order:updated', order);
  }

  @SubscribeMessage('order:status')
  async handleOrderStatus(
    @MessageBody() data: { orderId: string; status: OrderStatus },
  ): Promise<void> {
    const order = await this.ordersService.updateStatus(data.orderId, { status: data.status });
    this.emitToRoom('kitchen', 'order:updated', order);
  }
}
