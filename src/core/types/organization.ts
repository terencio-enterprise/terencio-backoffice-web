
export type CompanyResponse = {
  id: string;
  name: string;
  taxId: string;
  currencyCode: string;
  fiscalRegime: string;
  priceIncludesTax: boolean;
  roundingMode: string;
  active: boolean;
};