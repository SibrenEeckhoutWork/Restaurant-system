import { apiService } from './api.service';

export interface SlotRoom {
  id: string;
  name: string;
  capacity: number;
}

export interface ReservationSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  isActive: boolean;
  recurrence: 'daily' | 'weekly' | 'monthly';
  daysOfWeek: number[] | null;
  monthDay: number | null;
  rooms?: SlotRoom[];
  reservations?: Reservation[];
}

export interface Reservation {
  id: string;
  date: string;
  customerId: string | null;
  customer: { id: string; name: string; email: string } | null;
  tableId: string;
  table: { id: string; name: string; capacity: number };
  slotId: string;
  slot: ReservationSlot;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateReservationPayload {
  date: string;
  slotId: string;
  tableId: string;
  partySize: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
}

function buildQs(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][];
  if (!entries.length) return '';
  return '?' + new URLSearchParams(entries).toString();
}

export const reservationsService = {
  getSlots: (params?: { date?: string }) =>
    apiService.get<ReservationSlot[]>(`/reservations/slots${buildQs(params ?? {})}`),

  createSlot: (data: {
    startTime: string;
    endTime: string;
    roomIds: string[];
    recurrence?: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    monthDay?: number;
  }) => apiService.post<ReservationSlot>('/reservations/slots', data),

  updateSlot: (id: string, data: {
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
    roomIds?: string[];
    recurrence?: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    monthDay?: number;
  }) => apiService.patch<ReservationSlot>(`/reservations/slots/${id}`, data),

  removeSlot: (id: string) => apiService.delete<void>(`/reservations/slots/${id}`),

  getAll: (params?: { date?: string; fromDate?: string; toDate?: string; status?: string }) =>
    apiService.get<Reservation[]>(`/reservations${buildQs(params ?? {})}`),

  getOne: (id: string) => apiService.get<Reservation>(`/reservations/${id}`),

  create: (data: CreateReservationPayload) =>
    apiService.post<Reservation>('/reservations/admin', data),

  updateStatus: (id: string, status: string) =>
    apiService.patch<Reservation>(`/reservations/${id}/status`, { status }),

  remove: (id: string) => apiService.delete<void>(`/reservations/${id}`),
  bulkRemove: (ids: string[]) => apiService.deleteWithBody<void>('/reservations/bulk', { ids }),
};
