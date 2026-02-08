import { apiClient } from '../api/http-client';
import type { StoreDto } from '../types';

export const AdminStoreService = {
  getAll: () => apiClient.get<StoreDto[]>('/api/v1/admin/stores'),
  getById: (id: string) => apiClient.get<StoreDto>(`/api/v1/admin/stores/${id}`),
  create: (data: StoreDto) => apiClient.post<StoreDto>('/api/v1/admin/stores', data),
  update: (id: string, data: StoreDto) => apiClient.put<StoreDto>(`/api/v1/admin/stores/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/admin/stores/${id}`),
};
