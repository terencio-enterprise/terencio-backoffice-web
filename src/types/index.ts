export interface Employee {
  id: number;
  username: string;
  fullName: string;
  role: string;
  organizationId: string | null;
  companyId: string | null;
  storeId: string | null;
  grants: string[];
  active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
  };
}
