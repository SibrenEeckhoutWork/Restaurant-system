import { Repository } from 'typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
import { CustomersService } from '../customers/customers.service.js';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly itemRepo;
    private readonly itemAccRepo;
    private readonly customersService;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, itemAccRepo: Repository<OrderItemAccessory>, customersService: CustomersService);
    findAll(tenantId: string): Promise<Order[]>;
    findById(id: string, tenantId: string): Promise<Order>;
    create(dto: CreateOrderDto, tenantId: string): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, tenantId: string): Promise<Order>;
    updateItems(id: string, dto: UpdateOrderItemsDto, tenantId: string): Promise<Order>;
    remove(id: string, tenantId: string): Promise<void>;
    bulkRemove(ids: string[], tenantId: string): Promise<void>;
    private saveItems;
    updateItemStatus(orderId: string, itemId: string, status: 'pending' | 'preparing' | 'ready' | 'delivered', tenantId: string): Promise<Order>;
}
