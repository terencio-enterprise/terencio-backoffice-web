import { useAuth } from "@/hooks/useAuth";
import { useScope } from "@/hooks/useScope";
import { cn } from "@/lib/utils";
import type { CompanyTreeDto } from "@/types/entities";
import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";

export function ScopeSelector() {
  const { user } = useAuth();
  const { activeCompany, switchCompany } = useScope();
  const [isOpen, setIsOpen] = useState(false);

  const handleCompanySelect = (company: CompanyTreeDto) => {
    switchCompany(company);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Selector Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors noSelect"
        style={{ backgroundColor: 'var(--surface-hover)' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-alt)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <Building2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{activeCompany?.name || "Select Company"}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              Company
            </p>
          </div>
        </div>
        <ChevronDown 
          className={cn("w-4 h-4 transition-transform flex-shrink-0", isOpen && "rotate-180")} 
          style={{ color: 'var(--text-tertiary)' }} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {/* Company List */}
            {user?.companies?.map((company: CompanyTreeDto) => {
              const isActiveCompany = activeCompany?.id === company.id;

              return (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={isActiveCompany ? { backgroundColor: 'var(--accent-light)' } : {}}
                  onMouseEnter={(e) => {
                    if (!isActiveCompany) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveCompany) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Building2 
                    className="w-4 h-4 flex-shrink-0" 
                    style={{ color: isActiveCompany ? 'var(--accent)' : 'var(--text-secondary)' }} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{company.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {company.stores.length} {company.stores.length === 1 ? 'store' : 'stores'}
                    </p>
                  </div>
                  {isActiveCompany && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  )}
                </button>
              );
            })}

            {(!user?.companies || user.companies.length === 0) && (
              <div className="px-4 py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No companies available</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
                        