import type { CompanyResponse } from '@/core/types/organization';
import { CompanyService } from '@/features/company/services/company.service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScopeState {
  activeCompany: CompanyResponse | null;
  companies: CompanyResponse[];
  isLoadingCompanies: boolean;

  setActiveCompany: (company: CompanyResponse | null) => void;
  setCompanies: (companies: CompanyResponse[]) => void;
  fetchCompanies: () => Promise<void>;
}

export const useScopeStore = create<ScopeState>()(
  persist(
    (set) => ({
      activeCompany: null,
      companies: [],
      isLoadingCompanies: false,

      setActiveCompany: (company) =>
        set({ activeCompany: company }),

      setCompanies: (companies) =>
        set({ companies }),

      fetchCompanies: async () => {
        set({ isLoadingCompanies: true });
        try {
          const companiesList = await CompanyService.getUserCompanies();
          set({ companies: companiesList, isLoadingCompanies: false });
        } catch (error) {
          console.error('Failed to load global companies', error);
          set({ isLoadingCompanies: false });
        }
      }
    }),
    {
      name: 'company-scope-storage',
      partialize: (state) => ({ activeCompany: state.activeCompany }),
    }
  )
);