import { apiService } from './api.service';

export interface RoomTable {
  id: string;
  name: string;
  capacity: number;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  tables: RoomTable[];
}

export interface CreateRoomPayload {
  name: string;
  capacity: number;
}

export interface UpdateRoomPayload {
  name?: string;
  capacity?: number;
}

export const roomsService = {
  getAll: () => apiService.get<Room[]>('/rooms'),
  getOne: (id: string) => apiService.get<Room>(`/rooms/${id}`),
  create: (data: CreateRoomPayload) => apiService.post<Room>('/rooms', data),
  update: (id: string, data: UpdateRoomPayload) => apiService.patch<Room>(`/rooms/${id}`, data),
  remove: (id: string) => apiService.delete<void>(`/rooms/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/rooms/bulk', { ids }),
};
