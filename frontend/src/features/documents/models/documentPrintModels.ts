export type DocumentKind = 'PRESUPUESTO' | 'PEDIDO' | 'ALBARAN' | 'FACTURA';

export type CompanyPrintInfo = {
  name: string;
  legalName?: string;
  taxId?: string;
  addressLines: ReadonlyArray<string>;
  phone?: string;
  email?: string;
  website?: string;
};

export type CustomerPrintInfo = {
  name: string;
  taxId?: string;
  addressLines: ReadonlyArray<string>;
  phone?: string;
  email?: string;
};

export type DocumentLineItem = {
  position: number;
  description: string;
  quantity: number;
  unitLabel?: string;
  unitPriceEur?: number | null;
  totalEur?: number | null;
};

export type DocumentTotals = {
  subtotalEur?: number | null;
  vatPercent?: number | null;
  vatAmountEur?: number | null;
  totalEur: number;
};

export type DocumentPrintData = {
  kind: DocumentKind;
  documentNumber: string;
  documentDate: string;
  company: CompanyPrintInfo;
  customer: CustomerPrintInfo;
  lines: DocumentLineItem[];
  totals?: DocumentTotals | null;
  notes?: string;
  footerLines?: string[];
};
