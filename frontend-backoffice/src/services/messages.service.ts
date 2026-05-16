import { apiService } from './api.service';

export interface ContactMessage {
  id: string;
  tenantId: string;
  naam: string;
  email: string;
  telefoon: string | null;
  onderwerp: string;
  bericht: string;
  isRead: boolean;
  createdAt: string;
}

export const messagesService = {
  getAll: () => apiService.get<ContactMessage[]>('/contact'),
  markRead: (id: string) => apiService.patch<ContactMessage>(`/contact/${id}/read`, {}),
  remove: (id: string) => apiService.delete<void>(`/contact/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/contact/bulk', { ids }),
};
