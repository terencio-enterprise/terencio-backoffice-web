import { useActiveContext } from "@/hooks/useScope";
import { AlertCircle, MapPin } from "lucide-react";
import type { ReactNode } from "react";

interface ScopedViewProps {
  children: ReactNode;
  requiresStore?: boolean;
  requiresCompany?: boolean;
}

/**
 * ScopedView guards routes that require specific context.
 * - If requiresStore is true, it will block access until a store is selected.
 * - If requiresCompany is true, it will block access until a company is selected.
 */
export function ScopedView({ 
  children, 
  requiresStore = false, 
  requiresCompany = true 
}: ScopedViewProps) {
  const { companyId, storeId, companyName } = useActiveContext();

  // Check if company is required but not set
  if (requiresCompany && !companyId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-8 rounded-lg border" style={{ 
          backgroundColor: 'var(--surface-alt)', 
          borderColor: 'var(--border)' 
        }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
          <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Please select a company from the sidebar to continue.
          </p>
        </div>
      </div>
    );
  }

  // Check if store is required but not set
  if (requiresStore && !storeId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-8 rounded-lg border" style={{ 
          backgroundColor: 'var(--surface-alt)', 
          borderColor: 'var(--border)' 
        }}>
          <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold mb-2">Store Required</h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
            This module requires a specific store to be selected.
            <br />
            Currently viewing: <strong>{companyName}</strong>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Please select a store from the <strong>Property Selector</strong> in the sidebar.
          </p>
        </div>
      </div>
    );
  }

  // All requirements met, render children
  return <>{children}</>;
}