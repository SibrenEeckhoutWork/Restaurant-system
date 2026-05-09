import { Repository } from 'typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly itemRepo;
    private readonly itemAccRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, itemAccRepo: Repository<OrderItemAccessory>);
    findAll(): Promise<Order[]>;
    findById(id: string): Promise<Order>;
    create(dto: CreateOrderDto): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>;
    updateItems(id: string, dto: UpdateOrderItemsDto): Promise<Order>;
    remove(id: string): Promise<void>;
    bulkRemove(ids: string[]): Promise<void>;
    private saveItems;
    updateItemStatus(orderId: string, itemId: string, status: 'pending' | 'preparing' | 'ready'): Promise<Order>;
}
