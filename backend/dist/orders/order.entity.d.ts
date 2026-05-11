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
    tableId: string | null;
    table: Table | null;
    customerName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    deliveryType: 'delivery' | 'pickup' | null;
    customerId: string | null;
    status: OrderStatus;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
