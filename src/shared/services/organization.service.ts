import { apiClient } from '@/core/lib/api-client';
import type { CompanyResponse } from '@/core/types/organization';


export const OrganizationService = {
  getCompanyInfo: (companyId: string) => 
    apiClient.get<CompanyResponse>(
      `/api/v1/companies/${companyId}`
    ),
}



