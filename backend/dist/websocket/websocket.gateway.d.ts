import { OnGatewayConnection } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
export declare class AppWebSocketGateway implements OnGatewayConnection {
    private readonly jwtService;
    private readonly config;
    private readonly server;
    private readonly logger;
    constructor(jwtService: JwtService, config: ConfigService);
    handleConnection(client: Socket): void;
    emitToRoom(room: string, event: string, payload: object): void;
    handleJoin(room: string, client: Socket): void;
}
