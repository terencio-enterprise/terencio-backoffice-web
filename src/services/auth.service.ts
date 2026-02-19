import type { LoginRequest, LoginResponse } from '@/types/auth';
import type { EmployeeInfoDto } from '@/types/entities';
import { apiClient } from '../api/http-client';

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/v1/auth/logout', {});
    } finally {
      window.location.href = '/login';
    }
  },

  getCurrentUser: async (): Promise<EmployeeInfoDto> => {
    const response = await apiClient.get<EmployeeInfoDto>('/api/v1/auth/me');
    return response;
  }
};
