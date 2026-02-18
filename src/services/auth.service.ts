import { apiClient } from '../api/http-client';
import type { ApiResponse, Employee, LoginRequest, LoginResponse } from '../types';

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/v1/auth/logout', {});
    } finally {
      window.location.href = '/login';
    }
  },

  getCurrentUser: async (): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>('/api/v1/auth/me');
    return response.data;
  }
};
