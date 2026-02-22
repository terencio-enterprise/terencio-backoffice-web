import { useCallback, useEffect, useState } from 'react';
import { MarketingService } from '@/services/marketing.service';
import type { CampaignResponse, CampaignAudienceMember, TemplateDto } from '@/types/marketing';

export function useMarketingTemplates(companyId: string | undefined) {
  const [data, setData] = useState<TemplateDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingService.getTemplates(companyId);
      setData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);
  return { data, isLoading, refetch: fetchTemplates };
}

export function useCampaigns(companyId: string | undefined) {
  const [data, setData] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingService.getCampaigns(companyId);
      setData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  return { data, isLoading, refetch: fetchCampaigns };
}
