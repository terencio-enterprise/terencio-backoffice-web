
import type { CompanyResponse } from "@/core/types/organization";
import { useScopeStore } from "@/store/useScopeStore";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function CompanySelector({ collapsed }: { collapsed?: boolean }) {
  const { t } = useTranslation();
  const { activeCompany, companies, isLoadingCompanies } = useScopeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const hasMultiple = useMemo(
    () => (companies?.length ?? 0) > 1,
    [companies]
  );

  const handleSelect = (company: CompanyResponse) => {
    setIsOpen(false);
    navigate(`/c/${company.id}`);
  };

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
          style={{ backgroundColor: "var(--surface-hover)" }}
        >
          <Building2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border text-left cursor-pointer transition-all duration-150 hover:bg-[var(--surface-hover)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
        aria-expanded={isOpen}
        aria-label={t("company.select")}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Building2
            className="w-4 h-4 shrink-0"
            style={{ color: "var(--accent)" }}
          />
          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {activeCompany?.name || t("company.select")}
            </p>
            <p
              className="text-[11px] truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {isLoadingCompanies
                ? t("common.loading")
                : t("company.active")}
            </p>
          </div>
        </div>

        {hasMultiple && (
          <ChevronsUpDown
            className="w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
        )}
      </button>

      {isOpen && hasMultiple && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute left-0 right-0 mt-2 rounded-md shadow-lg border z-50 max-h-80 overflow-y-auto"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            {companies.map((company) => {
              const isActive = activeCompany?.id === company.id;

              return (
                <button
                  key={company.id}
                  onClick={() => handleSelect(company)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Building2
                      className="w-4 h-4 shrink-0"
                      style={{
                        color: isActive
                          ? "var(--accent)"
                          : "var(--text-secondary)",
                      }}
                    />
                    <span
                      className="truncate"
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {company.name}
                    </span>
                  </div>

                  {isActive && (
                    <Check
                      className="w-4 h-4"
                      style={{ color: "var(--accent)" }}
                    />
                  )}
                </button>
              );
            })}

            {companies.length === 0 && !isLoadingCompanies && (
              <div
                className="px-4 py-6 text-sm text-center"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t("company.none")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
