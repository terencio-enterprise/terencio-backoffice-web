import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';
import { AppConfig } from '../config/app.config';
import type { ApiResponse } from '../types/api';

/**
 * Enterprise Grade HTTP Client
 * - Singleton instance
 * - Auth Token Injection (via Cookies)
 * - Automatic Token Refresh
 * - Standardized Error Handling
 */
class HttpClient {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void; }[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: AppConfig.API_BASE_URL,
      timeout: AppConfig.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.initializeInterceptors();
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private initializeInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Return if no response or if it's not a 401
        if (!error.response || error.response.status !== 401 || !originalRequest) {
          return Promise.reject(this.handleError(error));
        }

        // Avoid infinite loops if refresh endpoint itself fails
        if (originalRequest.url?.includes('/auth/refresh')) {
            console.warn('Refresh token expired or invalid. Logging out.');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // If not already refreshing, start refresh process
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          try {
            await this.api.post('/api/v1/auth/refresh');
            this.isRefreshing = false;
            this.processQueue(null);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError as Error, null);
            this.isRefreshing = false;
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // If refreshing, queue the request
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then(() => {
          return this.api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
    );
  }

  private handleError(error: AxiosError | unknown) {
      // Logic to normalize errors can go here if needed 
      // leveraging ApiError type from response data
      return error;
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get<ApiResponse<T>>(url, config).then(r => r.data.data as T);
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<ApiResponse<T>>(url, data, config).then(r => r.data.data as T);
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<ApiResponse<T>>(url, data, config).then(r => r.data.data as T);
  }

  public patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch<ApiResponse<T>>(url, data, config).then(r => r.data.data as T);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<ApiResponse<T>>(url, config).then(r => r.data.data as T);
  }
}

export const apiClient = new HttpClient();
