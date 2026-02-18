export interface ApiError {
  code: string;
  message: string;
  details?: ErrorDetail[];
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta: {
    timestamp: string;
  };
}
