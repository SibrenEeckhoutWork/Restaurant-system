import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    findAll(): Promise<import("./order.entity.js").Order[]>;
    findOne(id: string): Promise<import("./order.entity.js").Order>;
    create(dto: CreateOrderDto): Promise<import("./order.entity.js").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("./order.entity.js").Order>;
    updateItems(id: string, dto: UpdateOrderItemsDto): Promise<import("./order.entity.js").Order>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
