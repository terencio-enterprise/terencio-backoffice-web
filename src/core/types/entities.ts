// Core Domain Entities
export interface StoreDto {
  id: string;
  name: string;
  slug: string;
}

export interface CompanyTreeDto {
  id: string;
  name: string;
  slug: string;
  stores: StoreDto[];
}

export interface EmployeeInfoDto {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  lastCompanyId: string | null;
  lastStoreId: string | null;
  companies: CompanyTreeDto[];
}

// Alias for backward compatibility
export type Employee = EmployeeInfoDto;

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

/**
 * Global application state shape for active context
 */
export interface AppContext {
  activeCompany: CompanyTreeDto | null;
  activeStore: StoreDto | null;
}
