import { apiService } from './api.service';

export interface Customer {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateCustomerPayload {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export const customersService = {
  getAll: () => apiService.get<Customer[]>('/customers'),
  getOne: (id: string) => apiService.get<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerPayload) => apiService.post<Customer>('/customers', data),
  update: (id: string, data: UpdateCustomerPayload) => apiService.patch<Customer>(`/customers/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/customers/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/customers/bulk', { ids }),
};
