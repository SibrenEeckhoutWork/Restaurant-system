import { apiService } from './api.service';

export interface Table {
  id: string;
  name: string;
  capacity: number;
  roomId: string;
  room?: { id: string; name: string; capacity: number };
}

export interface CreateTablePayload {
  name: string;
  capacity: number;
  roomId: string;
}

export interface UpdateTablePayload {
  name?: string;
  capacity?: number;
  roomId?: string;
}

export const tablesService = {
  getAll: (roomId?: string) =>
    apiService.get<Table[]>(roomId ? `/tables?roomId=${encodeURIComponent(roomId)}` : '/tables'),
  getOne: (id: string) => apiService.get<Table>(`/tables/${id}`),
  create: (data: CreateTablePayload) => apiService.post<Table>('/tables', data),
  update: (id: string, data: UpdateTablePayload) => apiService.patch<Table>(`/tables/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/tables/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/tables/bulk', { ids }),
};
