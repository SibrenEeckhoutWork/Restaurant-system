import { CreateOrderItemDto } from './create-order-item.dto.js';
export declare class CreateOrderDto {
    tableId?: string;
    customerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryType?: 'delivery' | 'pickup';
    notes?: string;
    items: CreateOrderItemDto[];
}
