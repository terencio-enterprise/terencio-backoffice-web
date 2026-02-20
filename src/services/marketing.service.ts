import { apiClient } from '@/api/http-client';
import type { CampaignLog, CampaignRequest, MockUser, RecipientInfo, TemplateDto } from '@/types/marketing';

export const MarketingService = {
  getTemplates: (companyId: string) => 
    apiClient.get<TemplateDto[]>(`/api/v1/companies/${companyId}/marketing/templates`),

  getTemplate: (companyId: string, id: number) => 
    apiClient.get<TemplateDto>(`/api/v1/companies/${companyId}/marketing/templates/${id}`),

  createTemplate: (companyId: string, payload: TemplateDto) => 
    apiClient.post<TemplateDto>(`/api/v1/companies/${companyId}/marketing/templates`, payload),

  updateTemplate: (companyId: string, id: number, payload: TemplateDto) => 
    apiClient.put<TemplateDto>(`/api/v1/companies/${companyId}/marketing/templates/${id}`, payload),

  getCampaigns: (companyId: string) => 
    apiClient.get<CampaignLog[]>(`/api/v1/companies/${companyId}/marketing/campaigns`),

  getCampaignRecipients: (companyId: string, campaignId: number) => 
    apiClient.get<RecipientInfo[]>(`/api/v1/companies/${companyId}/marketing/campaigns/${campaignId}/recipients`),

  getAudience: (companyId: string) => 
    apiClient.get<MockUser[]>(`/api/v1/companies/${companyId}/marketing/audience`),

  launchCampaign: (companyId: string, payload: CampaignRequest) => 
    apiClient.post<{ sentCount: number }>(`/api/v1/companies/${companyId}/marketing/campaigns`, payload),

  dryRunCampaign: (companyId: string, templateId: number, testEmail: string) => 
    apiClient.post<void>(`/api/v1/companies/${companyId}/marketing/campaigns/dry-run`, { templateId, testEmail })
};