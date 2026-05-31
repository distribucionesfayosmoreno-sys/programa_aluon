import type { QuoteItemResponse, QuoteResponse } from '../../customer-onboarding/models';
import type { ProjectDocumentKind } from '../ProjectManagement.types';

export type QuoteLifecycleNumbersResponse = {
  seriesKey: string;
  presupuesto: string;
  pedido: string;
  albaran: string;
  factura: string;
  abono: string;
};

export type DocumentDrawerRow = {
  projectId: string;
  quoteId: string;
  kind: ProjectDocumentKind;
  number: string;
  customerName: string;
  createdAt: string;
};

export type DocumentTotals = {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
};

export type DocumentDrawerData = {
  quote: QuoteResponse;
  lifecycle: QuoteLifecycleNumbersResponse;
  totals: DocumentTotals;
  items: QuoteItemResponse[];
  docTypeLabel: string;
  docNumber: string;
};

