import { apiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Allergy {
  id: string;
  name: string;
  icon: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
  allergies: Allergy[];
  accessories: { id: string; name: string; price: number }[];
}

export const categoriesService = {
  getAll: () => apiService.get<Category[]>('/categories'),
  getOne: (id: string) => apiService.get<Category>(`/categories/${id}`),
  create: (data: { name: string; sortOrder?: number }) => apiService.post<Category>('/categories', data),
  update: (id: string, data: { name?: string; sortOrder?: number }) => apiService.patch<Category>(`/categories/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/categories/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/categories/bulk', { ids }),
};

export const allergiesService = {
  getAll: () => apiService.get<Allergy[]>('/allergies'),
  create: (data: { name: string; icon?: string }) => apiService.post<Allergy>('/allergies', data),
  update: (id: string, data: { name?: string; icon?: string }) => apiService.patch<Allergy>(`/allergies/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/allergies/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/allergies/bulk', { ids }),
};

export const productsService = {
  getAll: () => apiService.get<Product[]>('/products'),
  getOne: (id: string) => apiService.get<Product>(`/products/${id}`),
  create: (data: {
    name: string;
    description?: string;
    price: number;
    isAvailable?: boolean;
    categoryId: string;
    allergyIds?: string[];
    accessoryIds?: string[];
  }) => apiService.post<Product>('/products', data),
  update: (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    isAvailable?: boolean;
    categoryId?: string;
    allergyIds?: string[];
    accessoryIds?: string[];
  }) => apiService.patch<Product>(`/products/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/products/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/products/bulk', { ids }),
};
