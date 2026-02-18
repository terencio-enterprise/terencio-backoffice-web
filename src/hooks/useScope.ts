import { useContext } from 'react';
import { ScopeContext } from '../contexts/ScopeContext';

/**
 * Hook to access the ScopeContext
 * Must be used within a ScopeProvider
 */
export function useScope() {
  const context = useContext(ScopeContext);
  if (!context) {
    throw new Error('useScope must be used within a ScopeProvider');
  }
  return context;
}

/**
 * Custom hook to get active context IDs and names for API calls
 * Returns both UUIDs (for API calls) and slugs (for URL construction)
 */
export function useActiveContext() {
  const { activeCompany, activeStore } = useScope();
  
  return {
    companyId: activeCompany?.id,
    storeId: activeStore?.id,
    companySlug: activeCompany?.slug,
    storeSlug: activeStore?.slug,
    companyName: activeCompany?.name,
    storeName: activeStore?.name,
  };
}
