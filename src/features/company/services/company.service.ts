import { apiClient } from '@/core/lib/api-client';
import type { CompanyResponse } from '@/core/types/organization';


export const CompanyService = {
  getCompanyInfo: (companyId: string) =>
    apiClient.get<CompanyResponse>(
      `/api/v1/companies/${companyId}`
    ),

  getUserCompanies: () =>
    apiClient.get<CompanyResponse[]>(
      `/api/v1/companies`
    ),
}



