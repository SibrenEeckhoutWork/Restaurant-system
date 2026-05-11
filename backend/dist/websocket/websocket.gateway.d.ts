import { OnGatewayConnection } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service.js';
import { OrderStatus } from '../orders/order.entity.js';
export declare class AppWebSocketGateway implements OnGatewayConnection {
    private readonly jwtService;
    private readonly config;
    private readonly ordersService;
    private readonly server;
    private readonly logger;
    constructor(jwtService: JwtService, config: ConfigService, ordersService: OrdersService);
    handleConnection(client: Socket): void;
    emitToRoom(room: string, event: string, payload: object): void;
    handleJoin(room: string, client: Socket): void;
    handleItemStatus(data: {
        orderId: string;
        itemId: string;
        status: 'pending' | 'preparing' | 'ready' | 'delivered';
    }): Promise<void>;
    handleOrderStatus(data: {
        orderId: string;
        status: OrderStatus;
    }): Promise<void>;
}
