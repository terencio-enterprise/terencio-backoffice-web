import type { CompanyResponse } from "@/core/types/organization";
import { useOutletContext } from "react-router-dom";

export function CompanyHome() {
  const { company } = useOutletContext<{ company: CompanyResponse }>();

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">
        {company?.name} Dashboard
      </h1>
      <p className="text-text-secondary">Welcome back to the corporate overview.</p>
    </div>
  );
}