export interface StoreDto {
  id: string;   // UUID for API calls
  name: string;
  slug: string; // for URL path
}

export interface CompanyTreeDto {
  id: string;   // UUID for API calls
  name: string;
  slug: string; // for URL path
  stores: StoreDto[];
}

export interface EmployeeInfoDto {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  lastCompanyId: string | null;  // UUID of last selected company
  lastStoreId: string | null;    // UUID of last selected store
  companies: CompanyTreeDto[];
}

// Alias for backward compatibility if needed, or refactor usages
export type Employee = EmployeeInfoDto;

/**
 * Global application state shape for active context
 */
export interface AppContext {
  activeCompany: CompanyTreeDto | null;
  activeStore: StoreDto | null;
}
