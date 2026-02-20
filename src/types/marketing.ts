export type TabType = 'overview' | 'campaigns' | 'audience' | 'templates' | 'analytics' | 'assets';

export interface TemplateDto {
  id?: number;
  code: string;
  name: string;
  subject: string;
  bodyHtml: string;
  active: boolean;
  lastModified?: string;
}

export interface CampaignLog {
  id: number;
  companyId: string;
  name: string;
  templateId: number;
  sentAt: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'SENDING' | 'FAILED' | 'DRAFT';
  recipientsCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  revenueAttributed: number;
}

export interface RecipientInfo {
  id: string;
  email: string;
  name: string;
  status: 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'COMPLAINED';
  lastActivity: string;
  clickedLinks?: string[];
  device?: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  type: string;
  totalSpent: number;
  tags: string[];
  subscribed: boolean;
}

export interface AudienceFilter {
  tags: string[];
  minSpent: number;
  customerType: string;
}

export interface CampaignRequest {
  name: string;
  templateId: number;
  audienceFilter: AudienceFilter;
  selectedUserIds: string[];
  scheduleDate?: string;
}

export interface LinkPerformance {
  url: string;
  uniqueClicks: number;
  totalClicks: number;
  ctr: number;
}