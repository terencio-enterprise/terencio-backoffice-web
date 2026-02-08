import { apiClient } from '../api/http-client';
import type { CreateUserRequest, UpdateUserRequest, UserDto } from '../types';

export const AdminUserService = {
  getAll: () => apiClient.get<UserDto[]>('/api/v1/admin/users'),
  getById: (id: number) => apiClient.get<UserDto>(`/api/v1/admin/users/${id}`),
  create: (data: CreateUserRequest) => apiClient.post<UserDto>('/api/v1/admin/users', data),
  update: (id: number, data: UpdateUserRequest) => apiClient.put<UserDto>(`/api/v1/admin/users/${id}`, data),
  
  changePin: (id: number, pin: string) => 
    apiClient.patch<void>(`/api/v1/admin/users/${id}/pin`, { pin }),
  
  changePassword: (id: number, password: string) => 
    apiClient.patch<void>(`/api/v1/admin/users/${id}/password`, { password }),

  getRoles: () => apiClient.get<string[]>('/api/v1/admin/users/roles'),
};
