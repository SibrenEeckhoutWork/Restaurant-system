import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { AppWebSocketGateway } from '../websocket/websocket.gateway.js';
export declare class OrdersController {
    private readonly service;
    private readonly tenantsService;
    private readonly gateway;
    constructor(service: OrdersService, tenantsService: TenantsService, gateway: AppWebSocketGateway);
    findAll(tenantId: string): Promise<import("./order.entity.js").Order[]>;
    findOne(id: string, tenantId: string): Promise<import("./order.entity.js").Order>;
    create(dto: CreateOrderDto): Promise<import("./order.entity.js").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, tenantId: string): Promise<import("./order.entity.js").Order>;
    updateItems(id: string, dto: UpdateOrderItemsDto, tenantId: string): Promise<import("./order.entity.js").Order>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
