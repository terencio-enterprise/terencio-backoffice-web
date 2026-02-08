export interface UserDto {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAREHOUSE' | string;
  isActive: number; // 1 = Active, 0 = Inactive
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  posPin: string; // 6 digits
  backofficePassword: string;
  fullName: string;
  role: string;
  storeId: string; // UUID
  permissions?: string[];
}

export interface UpdateUserRequest {
  fullName: string;
  role: string;
  storeId: string; // UUID
  isActive?: boolean;
  permissions?: string[];
}
