import type { CompanyResponse } from "@/core/types/organization";
import { OrganizationService } from "@/shared/services/organization.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState<CompanyResponse | null>(null);

  useEffect(() => {
    if (companyId) {
      OrganizationService.getCompanyInfo(companyId).then((res) => {
        setCompany(res);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [companyId]);

  return (
    <h1>Company Page {companyId} {company?.name}</h1>
  );
}
