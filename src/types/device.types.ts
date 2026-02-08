import type { UserDto } from "./user.types";

export interface DeviceDto {
  id: string; // UUID
  storeId: string; // UUID
  storeName?: string;
  serialCode?: string;
  hardwareId?: string;
  status?: string;
  versionApp?: string;
  lastSyncAt?: string;
  createdAt?: string;
}

export interface GenerateCodeRequest {
  storeId: string;
  posName: string;
  validityHours?: number;
}

export interface GeneratedCodeDto {
  code: string;
  posName: string;
  expiresAt: string;
}

export interface SetupPreviewRequest {
  code: string;
  deviceId: string;
}

export interface SetupPreviewDto {
  posId: string;
  posName: string;
  storeId: string;
  storeName: string;
  users: UserDto[];
}

export interface SetupConfirmRequest {
  code: string;
  hardwareId: string;
}

export interface SetupResultDto {
  storeId: string;
  storeName: string;
  deviceId: string;
  serialCode: string;
  licenseKey: string;
}
