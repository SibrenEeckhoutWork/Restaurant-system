"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const socket_io_1 = require("socket.io");
let AppWebSocketGateway = AppWebSocketGateway_1 = class AppWebSocketGateway {
    jwtService;
    config;
    server;
    logger = new common_1.Logger(AppWebSocketGateway_1.name);
    constructor(jwtService, config) {
        this.jwtService = jwtService;
        this.config = config;
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token ??
            client.handshake.headers.authorization?.replace('Bearer ', '');
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
            }
            catch {
                return false;
            }
        });
        if (!valid) {
            this.logger.warn(`WS rejected — invalid token (${client.id})`);
            client.disconnect();
        }
    }
    emitToRoom(room, event, payload) {
        this.server.to(room).emit(event, payload);
    }
    handleJoin(room, client) {
        void client.join(room);
    }
};
exports.AppWebSocketGateway = AppWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppWebSocketGateway.prototype, "handleJoin", null);
exports.AppWebSocketGateway = AppWebSocketGateway = AppWebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: process.env.FRONTEND_URL } }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AppWebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map