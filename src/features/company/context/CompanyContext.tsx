import type { CompanyResponse } from "@/core/types/organization";
import { createContext, useContext } from "react";

interface CompanyContextValue {
  company: CompanyResponse;
}

export const CompanyContext = createContext<CompanyContextValue | null>(null);

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyLayout");
  return ctx;
}