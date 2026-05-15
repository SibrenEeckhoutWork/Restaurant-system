import { CreateOrderItemDto } from './create-order-item.dto.js';
export declare class CreateOrderDto {
    tenantSlug: string;
    tableId?: string;
    customerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryType?: 'delivery' | 'pickup';
    notes?: string;
    items: CreateOrderItemDto[];
}
