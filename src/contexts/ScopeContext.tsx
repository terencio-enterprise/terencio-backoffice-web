import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CompanyTreeDto, EmployeeInfoDto, StoreDto } from '../types/entities';

interface ScopeContextValue {
  activeCompany: CompanyTreeDto | null;
  activeStore: StoreDto | null;
  setActiveCompany: (company: CompanyTreeDto | null) => void;
  setActiveStore: (store: StoreDto | null) => void;
  switchCompany: (company: CompanyTreeDto) => void;
  switchStore: (store: StoreDto | null) => void;
  resolveContextFromSlugs: (companySlug: string, storeSlug?: string) => { company: CompanyTreeDto | null; store: StoreDto | null };
}

// eslint-disable-next-line react-refresh/only-export-components
export const ScopeContext = createContext<ScopeContextValue | undefined>(undefined);

interface ScopeProviderProps {
  children: React.ReactNode;
  identity: EmployeeInfoDto | null;
}

export function ScopeProvider({ children, identity }: ScopeProviderProps) {
  const [activeCompany, setActiveCompany] = useState<CompanyTreeDto | null>(null);
  const [activeStore, setActiveStore] = useState<StoreDto | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const { companySlug, storeSlug } = useParams<{ companySlug: string; storeSlug: string }>();

  // Helper function to find company and store by slugs
  const resolveContextFromSlugs = useCallback((cSlug: string, sSlug?: string) => {
    if (!identity?.companies) {
      return { company: null, store: null };
    }
    
    const company = identity.companies.find(c => c.slug === cSlug);
    const store = company && sSlug ? company.stores.find(s => s.slug === sSlug) : null;
    
    return { company: company || null, store: store || null };
  }, [identity]);

  // Initialize context from URL or backend lastCompanyId/lastStoreId (only once)
  /* eslint-disable */
  useEffect(() => {
    if (!identity?.companies?.length || initialized) return;

    let targetCompany: CompanyTreeDto | null = null;
    let targetStore: StoreDto | null = null;
    let shouldNavigate = false;

    // If URL has company slug, try to resolve it
    if (companySlug) {
      const { company, store } = resolveContextFromSlugs(companySlug, storeSlug);
      
      if (company) {
        targetCompany = company;
        targetStore = store;
      }
    }

    // Fallback: Use lastCompanyId from backend, or first company
    if (!targetCompany) {
      if (identity.lastCompanyId) {
        targetCompany = identity.companies.find(c => c.id === identity.lastCompanyId) || identity.companies[0];
        
        // Try to restore last store if it belongs to the company
        if (identity.lastStoreId && targetCompany) {
          targetStore = targetCompany.stores.find(s => s.id === identity.lastStoreId) || null;
        }
      } else {
        targetCompany = identity.companies[0];
        targetStore = null;
      }
      shouldNavigate = true;
    }

    // This is initialization logic, not a side effect
    setActiveCompany(targetCompany);
    setActiveStore(targetStore);
    setInitialized(true);
    
    if (shouldNavigate && targetCompany) {
      if (targetStore) {
        navigate(`/${targetCompany.slug}/${targetStore.slug}`, { replace: true });
      } else {
        navigate(`/${targetCompany.slug}`, { replace: true });
      }
    }
  }, [identity, companySlug, storeSlug, initialized, navigate, resolveContextFromSlugs]);
  /* eslint-enable */

  // Sync context when URL changes manually (after initialization)
  /* eslint-disable */
  useEffect(() => {
    if (!identity?.companies?.length || !companySlug || !initialized) return;

    const { company, store } = resolveContextFromSlugs(companySlug, storeSlug);
    
    // This syncs URL changes to state, not a typical side effect
    if (company && company.id !== activeCompany?.id) {
      setActiveCompany(company);
    }
    
    if (store?.id !== activeStore?.id) {
      setActiveStore(store);
    }
  }, [companySlug, storeSlug, identity, activeCompany?.id, activeStore?.id, initialized, resolveContextFromSlugs]);
  /* eslint-enable */

  const switchCompany = useCallback((company: CompanyTreeDto) => {
    setActiveCompany(company);
    setActiveStore(null);
    // Redirect to company level
    navigate(`/${company.slug}`);
  }, [navigate]);

  const switchStore = useCallback((store: StoreDto | null) => {
    if (!activeCompany) return;
    
    setActiveStore(store);
    
    if (store) {
      navigate(`/${activeCompany.slug}/${store.slug}`);
    } else {
      navigate(`/${activeCompany.slug}`);
    }
  }, [activeCompany, navigate]);

  return (
    <ScopeContext.Provider
      value={{
        activeCompany,
        activeStore,
        setActiveCompany,
        setActiveStore,
        switchCompany,
        switchStore,
        resolveContextFromSlugs,
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
}