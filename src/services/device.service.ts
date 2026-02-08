import { apiClient } from '../api/http-client';
import type {
    DeviceDto,
    GenerateCodeRequest,
    GeneratedCodeDto,
    SetupConfirmRequest,
    SetupPreviewDto,
    SetupPreviewRequest,
    SetupResultDto
} from '../types';

// Admin Context
export const AdminDeviceService = {
  getAll: () => apiClient.get<DeviceDto[]>('/api/v1/admin/devices'),
  generateCode: (data: GenerateCodeRequest) => 
    apiClient.post<GeneratedCodeDto>('/api/v1/admin/devices/codes', data),
  updateStatus: (id: string, action: 'block' | 'unblock' | 'reset') => 
    apiClient.patch<void>(`/api/v1/admin/devices/${id}/status`, null, { params: { action } }),
};

// Public/POS Context
export const PublicDeviceService = {
  previewSetup: (data: SetupPreviewRequest) => 
    apiClient.post<SetupPreviewDto>('/api/v1/devices/setup/preview', data),
  confirmSetup: (data: SetupConfirmRequest) => 
    apiClient.post<SetupResultDto>('/api/v1/devices/setup/confirm', data),
};
