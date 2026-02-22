import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScopeState {
  companyId: string | null;
  storeId: string | null;
  setCompany: (id: string | null) => void;
  setStore: (id: string | null) => void;
}

export const useScopeStore = create<ScopeState>()(
  persist(
    (set) => ({
      companyId: null,
      storeId: null,
      setCompany: (id) => set({ companyId: id, storeId: null }),
      setStore: (id) => set({ storeId: id }),
    }),
    { 
      name: 'scope-storage',
      partialize: (state) => ({ 
        companyId: state.companyId, 
        storeId: state.storeId 
      }),
    }
  )
);