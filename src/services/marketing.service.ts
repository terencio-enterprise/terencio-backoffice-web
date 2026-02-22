import { apiClient } from '@/api/http-client';
import type {
  CampaignAudienceMember,
  CampaignResponse,
  CreateCampaignRequest,
  TemplateDto
} from '@/types/marketing';

export const MarketingService = {
  // --- Templates ---
  getTemplates: (companyId: string) => 
    apiClient.get<TemplateDto[]>(
      `/api/v1/companies/${companyId}/marketing/templates`
    ),

  getTemplate: (companyId: string, id: number) => 
    apiClient.get<TemplateDto>(
      `/api/v1/companies/${companyId}/marketing/templates/${id}`
    ),

  createTemplate: (companyId: string, payload: TemplateDto) => 
    apiClient.post<TemplateDto>(
      `/api/v1/companies/${companyId}/marketing/templates`,
      payload
    ),

  updateTemplate: (companyId: string, id: number, payload: TemplateDto) => 
    apiClient.put<TemplateDto>(
      `/api/v1/companies/${companyId}/marketing/templates/${id}`,
      payload
    ),

  deleteTemplate: (companyId: string, id: number) => 
    apiClient.delete<void>(
      `/api/v1/companies/${companyId}/marketing/templates/${id}`
    ),

  // --- Campaigns ---
  getCampaigns: (companyId: string) => 
    apiClient.get<CampaignResponse[]>(
      `/api/v1/companies/${companyId}/marketing/campaigns`
    ),

  getCampaign: (companyId: string, id: number) => 
    apiClient.get<CampaignResponse>(
      `/api/v1/companies/${companyId}/marketing/campaigns/${id}`
    ),

  getCampaignAudience: (companyId: string, id: number) => 
    apiClient.get<CampaignAudienceMember[]>(
      `/api/v1/companies/${companyId}/marketing/campaigns/${id}/audience`
    ),

  createDraft: (companyId: string, payload: CreateCampaignRequest) => 
    apiClient.post<CampaignResponse>(
      `/api/v1/companies/${companyId}/marketing/campaigns/draft`,
      payload
    ),

  launchCampaign: (companyId: string, id: number) => 
    apiClient.post<void>(
      `/api/v1/companies/${companyId}/marketing/campaigns/${id}/launch`
    ),

  relaunchCampaign: (companyId: string, id: number) => 
    apiClient.post<void>(
      `/api/v1/companies/${companyId}/marketing/campaigns/${id}/relaunch`
    ),

  scheduleCampaign: (companyId: string, id: number, scheduledAt: string) => 
    apiClient.post<void>(
      `/api/v1/companies/${companyId}/marketing/campaigns/${id}/schedule?scheduledAt=${encodeURIComponent(scheduledAt)}`
    ),
    
  dryRunCampaign: (companyId: string, templateId: number, testEmail: string) => 
    apiClient.post<void>(
      `/api/v1/companies/${companyId}/marketing/campaigns/dry-run`,
      { templateId, testEmail }
    )
};