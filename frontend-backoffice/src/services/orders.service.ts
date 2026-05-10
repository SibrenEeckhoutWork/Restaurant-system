import { apiService } from './api.service';
import type { Table } from './tables.service';
import type { Product, Accessory } from './products.service';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItemAccessory {
  id: string;
  accessoryId: string;
  accessory: Accessory;
  quantity: number;
}

export type ItemStatus = 'pending' | 'preparing' | 'ready';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  notes: string | null;
  itemStatus: ItemStatus;
  accessories: OrderItemAccessory[];
}

export interface Order {
  id: string;
  tableId: string;
  table: Table;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemAccessoryPayload {
  accessoryId: string;
  quantity: number;
}

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  notes?: string | null;
  accessories?: OrderItemAccessoryPayload[];
}

export const ordersService = {
  getAll: () => apiService.get<Order[]>('/orders'),
  getOne: (id: string) => apiService.get<Order>(`/orders/${id}`),
  create: (data: { tableId: string; items: CreateOrderItemPayload[] }) =>
    apiService.post<Order>('/orders', data),
  updateStatus: (id: string, status: OrderStatus) =>
    apiService.patch<Order>(`/orders/${id}/status`, { status }),
  updateItems: (id: string, items: CreateOrderItemPayload[]) =>
    apiService.patch<Order>(`/orders/${id}/items`, { items }),
  remove: (id: string) => apiService.delete<void>(`/orders/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/orders/bulk', { ids }),
};
