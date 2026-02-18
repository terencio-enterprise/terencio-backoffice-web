export interface EmployeeInfoDto {
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

// Alias for backward compatibility if needed, or refactor usages
export type Employee = EmployeeInfoDto;
