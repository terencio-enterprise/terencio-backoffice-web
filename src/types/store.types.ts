export interface StoreDto {
  id: string; // UUID
  code: string;
  name: string;
  address?: string;
  taxId?: string;
  isActive?: boolean;
}
