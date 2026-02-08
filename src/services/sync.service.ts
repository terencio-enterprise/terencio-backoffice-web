import { apiClient } from '../api/http-client';
import type { SyncRequest, SyncResponseDto } from '../types';

export const SyncService = {
  pollUpdates: (data: SyncRequest) => 
    apiClient.post<SyncResponseDto>('/api/v1/sync/poll', data),
};
