import { apiClient } from '../api/http-client';
import { AppConfig } from '../config/app.config';
import type { LoginRequest, LoginResponse } from '../types';

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
    if (response.token) {
      localStorage.setItem(AppConfig.TOKEN_STORAGE_KEY, response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem(AppConfig.TOKEN_STORAGE_KEY);
    window.location.reload();
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AppConfig.TOKEN_STORAGE_KEY);
  }
};
