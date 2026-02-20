import { useCallback, useEffect, useState } from 'react';
import { MarketingService } from '@/services/marketing.service';
import type { CampaignLog, LinkPerformance, MockUser, RecipientInfo, TemplateDto } from '@/types/marketing';

export function useMarketingTemplates(companyId: string | undefined) {
  const [data, setData] = useState<TemplateDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingService.getTemplates(companyId);
      setData(res);
    } catch (err: any) {
      setData([
        { id: 1, code: 'WELCOME_01', name: 'New User Welcome Flow', subject: 'Welcome to the club, {{name}}!', bodyHtml: '<h1>Hi there, {{name}}!</h1><p>Check our latest offers.</p>', active: true },
        { id: 2, code: 'PROMO_BF', name: 'Black Friday Deals', subject: 'Don\'t miss out on 50% OFF!', bodyHtml: '<h1>Sale!</h1><a href="https://example.com/offer">Click here</a>', active: true },
        { id: 3, code: 'NEWS_JAN', name: 'January Newsletter', subject: 'What is new this year', bodyHtml: '<h1>Updates</h1>', active: false },
        { id: 4, code: 'ABANDON_CART', name: 'Abandoned Cart Recovery', subject: 'You left something behind...', bodyHtml: '<h1>Come back!</h1>', active: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);
  return { data, isLoading, refetch: fetchTemplates };
}

export function useCampaignLogs(companyId: string | undefined) {
  const [data, setData] = useState<CampaignLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingService.getCampaigns(companyId);
      setData(res);
    } catch (err) {
      setData([
        { id: 101, companyId, name: 'Spring Promo Blast', templateId: 1, sentAt: new Date(Date.now() - 86400000).toISOString(), status: 'COMPLETED', recipientsCount: 14500, openRate: 42.5, clickRate: 15.2, bounceRate: 0.8, revenueAttributed: 12450.00 },
        { id: 102, companyId, name: 'VIP Exclusive Offer', templateId: 2, sentAt: new Date(Date.now() - 36000000).toISOString(), status: 'COMPLETED', recipientsCount: 3200, openRate: 68.1, clickRate: 34.5, bounceRate: 0.1, revenueAttributed: 8900.50 },
        { id: 103, companyId, name: 'Inactive Users Winback', templateId: 4, sentAt: new Date().toISOString(), status: 'SENDING', recipientsCount: 25000, openRate: 5.4, clickRate: 1.1, bounceRate: 0.0, revenueAttributed: 0 },
        { id: 104, companyId, name: 'Summer Catalog Preview', templateId: 3, sentAt: new Date(Date.now() + 86400000).toISOString(), status: 'SCHEDULED', recipientsCount: 45000, openRate: 0, clickRate: 0, bounceRate: 0, revenueAttributed: 0 },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  return { data, isLoading, refetch: fetchLogs };
}

export function useCampaignDetails(companyId: string | undefined, campaignId: number | null) {
  const [recipients, setRecipients] = useState<RecipientInfo[]>([]);
  const [links, setLinks] = useState<LinkPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || !campaignId) return;
    setIsLoading(true);
    setTimeout(() => {
      setRecipients([
        { id: 'usr_1', email: 'john.doe@example.com', name: 'John Doe', status: 'CLICKED', lastActivity: new Date(Date.now() - 300000).toISOString(), clickedLinks: ['https://yoursite.com/promo'], device: 'Apple Mail / iOS' },
        { id: 'usr_2', email: 'sarah.smith@example.com', name: 'Sarah Smith', status: 'OPENED', lastActivity: new Date(Date.now() - 450000).toISOString(), device: 'Gmail / Desktop' },
        { id: 'usr_3', email: 'mike.j@example.com', name: 'Mike Johnson', status: 'DELIVERED', lastActivity: new Date(Date.now() - 1000000).toISOString(), device: 'Unknown' },
        { id: 'usr_4', email: 'invalid.email@fake.com', name: 'Fake User', status: 'BOUNCED', lastActivity: new Date(Date.now() - 1200000).toISOString(), device: 'Unknown' },
        { id: 'usr_5', email: 'angry.customer@example.com', name: 'Angry Customer', status: 'COMPLAINED', lastActivity: new Date(Date.now() - 800000).toISOString(), device: 'Outlook / Android' },
      ]);
      setLinks([
        { url: 'https://yoursite.com/promo/black-friday', uniqueClicks: 1240, totalClicks: 1450, ctr: 8.5 },
        { url: 'https://yoursite.com/collections/new', uniqueClicks: 850, totalClicks: 910, ctr: 5.8 },
        { url: 'https://yoursite.com/unsubscribe', uniqueClicks: 42, totalClicks: 45, ctr: 0.2 },
      ]);
      setIsLoading(false);
    }, 600);
  }, [companyId, campaignId]);

  return { recipients, links, isLoading };
}

export function useAudience(companyId: string | undefined) {
  const [data, setData] = useState<MockUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    setIsLoading(true);
    setTimeout(() => {
      setData([
        { id: 'u1', name: 'Alice Walker', email: 'alice@example.com', type: 'B2C', totalSpent: 1450.00, tags: ['vip', 'active'], subscribed: true },
        { id: 'u2', name: 'Tech Solutions Inc', email: 'billing@techsol.com', type: 'B2B', totalSpent: 12400.50, tags: ['wholesale', 'net30'], subscribed: true },
        { id: 'u3', name: 'Bob Harris', email: 'bob.h@example.com', type: 'B2C', totalSpent: 45.00, tags: ['new'], subscribed: true },
        { id: 'u4', name: 'Charlie Davis', email: 'charlie@example.com', type: 'B2C', totalSpent: 0.00, tags: ['inactive'], subscribed: false },
        { id: 'u5', name: 'MegaCorp', email: 'procurement@megacorp.com', type: 'B2B', totalSpent: 55000.00, tags: ['vip', 'enterprise'], subscribed: true },
        { id: 'u6', name: 'Diana Prince', email: 'diana@example.com', type: 'B2C', totalSpent: 320.00, tags: ['returning'], subscribed: true },
        { id: 'u7', name: 'Evan Wright', email: 'evan@example.com', type: 'B2C', totalSpent: 0.00, tags: ['bounced'], subscribed: false },
      ]);
      setIsLoading(false);
    }, 500);
  }, [companyId]);

  return { data, isLoading };
}