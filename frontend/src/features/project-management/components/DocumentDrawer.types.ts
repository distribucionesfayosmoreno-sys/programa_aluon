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

export type QuoteDocumentRowResponse = {
  id: string;
  tipo: ProjectDocumentKind | string;
  numeroDocumento: string;
  createdAt: string;
};

export type DocumentDrawerRow = {
  projectId: string;
  quoteId: string;
  kind: ProjectDocumentKind;
  number: string;
  customerName: string;
  createdAt: string;
};

export type QuoteDocumentDrawerData = {
  kind: 'quote';
  quote: QuoteResponse;
  lifecycle: QuoteLifecycleNumbersResponse;
  existingDocuments: QuoteDocumentRowResponse[];
  totals: DocumentTotals;
  items: QuoteItemResponse[];
  docTypeLabel: string;
  docNumber: string;
};

export type ManualDocumentDrawerData = {
  kind: 'manual';
  document: {
    id: string;
    rowId: string;
    customerName: string;
    type: string;
    number: string;
    statusLabel: string;
    createdAt: string;
  };
};

export type DocumentTotals = {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
};

export type DocumentDrawerData = QuoteDocumentDrawerData | ManualDocumentDrawerData;
