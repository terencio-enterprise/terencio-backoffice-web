export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED' | 'OPENED' | 'COMPLAINED';

export interface AudienceFilter {
  tags?: string[];
  minSpent?: number;
  customerType?: string;
}

export interface CreateCampaignRequest {
  name: string;
  templateId: number;
  audienceFilter: AudienceFilter;
}

export interface CampaignResponse {
  id: number;
  name: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  metricsTotalRecipients: number;
  metricsSent: number;
  metricsOpened: number;
  metricsClicked: number;
  metricsBounced: number;
}

export interface CampaignAudienceMember {
  customerId: number;
  email: string;
  name: string;
  status: DeliveryStatus;
}

export interface TemplateDto {
  id?: number;
  code: string;
  name: string;
  subject: string;
  bodyHtml: string;
  active: boolean;
  lastModified?: string;
}
