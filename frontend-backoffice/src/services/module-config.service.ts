import { apiService } from './api.service';

export interface ModuleConfigEntry {
  permission: string;
  required: boolean;
}

export const moduleConfigService = {
  getAll: () => apiService.get<ModuleConfigEntry[]>('/module-config'),
  setRequired: (permission: string, required: boolean) =>
    apiService.patch<ModuleConfigEntry>(`/module-config/${encodeURIComponent(permission)}`, { required }),
};
