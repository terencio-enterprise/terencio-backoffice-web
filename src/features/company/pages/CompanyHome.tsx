import { useCompany } from "../context/CompanyContext";


export function CompanyHome() {
  const { company } = useCompany();

  return (
    <h1>Company Page {company?.name}</h1>
  );
}
