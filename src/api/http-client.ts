import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AppConfig } from '../config/app.config';

/**
 * Enterprise Grade HTTP Client
 * - Singleton instance
 * - Auth Token Injection
 * - Standardized Error Handling
 */
class HttpClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: AppConfig.API_BASE_URL,
      timeout: AppConfig.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request: Inject Bearer Token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AppConfig.TOKEN_STORAGE_KEY);
        if (token && config.headers) {
          config.headers[AppConfig.AUTH_HEADER_KEY] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response: Handle Global Errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
           console.warn('Session expired or unauthorized.');
           // Dispatch logout action here if using Redux/Context
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get<T>(url, config).then(r => r.data);
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<T>(url, data, config).then(r => r.data);
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<T>(url, data, config).then(r => r.data);
  }

  public patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch<T>(url, data, config).then(r => r.data);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<T>(url, config).then(r => r.data);
  }
}

export const apiClient = new HttpClient();
