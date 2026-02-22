import { cn } from "@/core/lib/utils";
import type { CompanyResponse } from "@/core/types/organization";
import { useScopeStore } from "@/store/useScopeStore";
import { Building2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ScopeSelector() {
  const { activeCompany, companies, isLoadingCompanies } = useScopeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const hasMultipleCompanies = useMemo(() => (companies?.length ?? 0) > 1, [companies]);

  const handleCompanySelect = (company: CompanyResponse) => {
    setIsOpen(false);
    navigate(`/c/${company.id}`);
  };

  if (!hasMultipleCompanies) {
    return (
      <div
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg noSelect"
        style={{ backgroundColor: "var(--surface-hover)" }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <Building2 className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {activeCompany?.name || companies?.[0]?.name || "Company"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {isLoadingCompanies ? "Loading scopes..." : "Active Company"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors noSelect"
        style={{ backgroundColor: "var(--surface-hover)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-alt)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <Building2 className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {activeCompany?.name || "Select Company"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {isLoadingCompanies ? "Loading scopes..." : "Active Company"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform flex-shrink-0", isOpen && "rotate-180")}
          style={{ color: "var(--text-tertiary)" }}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            role="listbox"
          >
            {companies.map((company: CompanyResponse) => {
              const isActiveCompany = activeCompany?.id === company.id;

              return (
                <button
                  type="button"
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-b-0"
                  style={{
                    ...(isActiveCompany ? { backgroundColor: "var(--accent-light)" } : {}),
                    borderColor: "var(--border-light)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveCompany) e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveCompany) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  role="option"
                  aria-selected={isActiveCompany}
                >
                  <Building2
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isActiveCompany ? "var(--accent)" : "var(--text-secondary)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {company.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      ID: {company.taxId || "N/A"}
                    </p>
                  </div>
                  {isActiveCompany && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                  )}
                </button>
              );
            })}

            {companies.length === 0 && !isLoadingCompanies && (
              <div className="px-4 py-8 text-center" style={{ color: "var(--text-tertiary)" }}>
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