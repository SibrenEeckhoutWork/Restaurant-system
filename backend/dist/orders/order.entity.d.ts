import { Table } from '../tables/table.entity.js';
import { OrderItem } from './order-item.entity.js';
export declare enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    tableId: string;
    table: Table;
    status: OrderStatus;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
