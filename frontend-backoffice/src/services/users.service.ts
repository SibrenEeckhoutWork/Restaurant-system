import { apiService } from './api.service';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  permissions?: string[];
}

export const usersService = {
  getAll: () => apiService.get<User[]>('/users'),
  getOne: (id: string) => apiService.get<User>(`/users/${id}`),
  create: (data: CreateUserPayload) => apiService.post<User>('/users', data),
  update: (id: string, data: UpdateUserPayload) => apiService.patch<User>(`/users/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/users/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/users/bulk', { ids }),
};
