import { Order } from './order.entity.js';
import { Product } from '../products/product.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    quantity: number;
    notes: string | null;
    accessories: OrderItemAccessory[];
}
