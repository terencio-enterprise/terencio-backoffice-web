import type { CompanyResponse } from '@/core/types/organization';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScopeState {
  activeCompany: CompanyResponse | null;
  companies: CompanyResponse[];

  setActiveCompany: (company: CompanyResponse | null) => void;
  setCompanies: (companies: CompanyResponse[]) => void;
}

export const useScopeStore = create<ScopeState>()(
  persist(
    (set) => ({
      activeCompany: null,
      companies: [],

      setActiveCompany: (company) =>
        set({ activeCompany: company }),

      setCompanies: (companies) =>
        set({ companies }),
    }),
    {
      name: 'company-scope-storage',
    }
  )
);