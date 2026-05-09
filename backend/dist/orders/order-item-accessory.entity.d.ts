import { OrderItem } from './order-item.entity.js';
import { Accessory } from '../products/accessory.entity.js';
export declare class OrderItemAccessory {
    id: string;
    orderItemId: string;
    orderItem: OrderItem;
    accessoryId: string;
    accessory: Accessory;
    quantity: number;
}
