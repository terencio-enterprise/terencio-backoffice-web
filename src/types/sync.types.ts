export interface SyncRequest {
  storeId: string; // UUID
  lastSync: string; // ISO Date
}

export interface SyncTaxDto {
  id: number;
  name: string;
  rate: number;
  surcharge: number;
  codeAeat?: string;
  active: boolean;
}

export interface SyncTariffDto {
  id: number;
  name: string;
  priority: number;
  active: boolean;
}

export interface SyncProductDto {
  id: number;
  uuid: string;
  reference: string;
  name: string;
  shortName?: string;
  description?: string;
  familyCode?: string;
  taxId: number;
  isWeighted: boolean;
  isService: boolean;
  isAgeRestricted: boolean;
  requiresManager: boolean;
  stockTracking: boolean;
  minStockAlert?: number;
  imageUrl?: string;
  active: boolean;
  updatedAt: string;
}

export interface SyncBarcodeDto {
  barcode: string;
  productId: number;
  type: string;
  isPrimary: boolean;
  quantityFactor: number;
}

export interface SyncPriceDto {
  productId: number;
  tariffId: number;
  price: number;
}

export interface SyncCustomerDto {
  id: number;
  uuid: string;
  taxId?: string;
  legalName?: string;
  commercialName?: string;
  address?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
  tariffId?: number;
  allowCredit: boolean;
  creditLimit?: number;
  surchargeApply: boolean;
  verifactuRef?: string;
  active: boolean;
  updatedAt: string;
}

export interface SyncResponseDto {
  serverTime: string;
  taxes: SyncTaxDto[];
  tariffs: SyncTariffDto[];
  products: SyncProductDto[];
  barcodes: SyncBarcodeDto[];
  prices: SyncPriceDto[];
  promotions: any[];
  customers: SyncCustomerDto[];
  users: any[];
}
