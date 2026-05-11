import { OrderItem } from './order-item.entity.js';
import { Product } from '../products/product.entity.js';
export declare class OrderItemAccessory {
    id: string;
    orderItemId: string;
    orderItem: OrderItem;
    accessoryId: string;
    accessory: Product;
    quantity: number;
}
