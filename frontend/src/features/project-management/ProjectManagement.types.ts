import type { QuoteResponse } from '../customer-onboarding/models';

export type ProjectDocumentKind = 'PRESUPUESTO' | 'PEDIDO' | 'ALBARAN' | 'FACTURA' | 'ABONO';

export type WorkOrderWorkflowStep =
  | 'INBOX'
  | 'REQUEST'
  | 'BUDGET'
  | 'VALIDATION'
  | 'DEV'
  | 'PROD'
  | 'FINAL';

export type ProjectOrderStatus = 'BORRADOR' | 'EN_ORDEN_TRABAJO' | 'FINALIZADO';
export type ProjectDeliveryNoteStatus = 'EMITIDO' | 'FACTURADO';
export type ProjectInvoiceStatus = 'EMITIDA' | 'PAGADA' | 'ANULADA';
export type ProjectCreditNoteStatus = 'EMITIDO';

export type ProjectQuoteDocument = {
  kind: 'PRESUPUESTO';
  quoteId: string;
  quoteNumber: string;
  status: QuoteResponse['status'];
  total: number;
  createdAt: string;
  validatedAt?: string | null;
  pdfUrl?: string;
};

export type ProjectOrderDocument = {
  kind: 'PEDIDO';
  orderId: string;
  orderNumber: string;
  status: ProjectOrderStatus;
  createdAt: string;
};

export type ProjectWorkOrder = {
  orderId: string;
  workflowStep: WorkOrderWorkflowStep;
  updatedAt: string;
};

export type ProjectDeliveryNoteDocument = {
  kind: 'ALBARAN';
  deliveryNoteId: string;
  deliveryNoteNumber: string;
  status: ProjectDeliveryNoteStatus;
  createdAt: string;
};

export type ProjectInvoiceDocument = {
  kind: 'FACTURA';
  invoiceId: string;
  invoiceNumber: string;
  status: ProjectInvoiceStatus;
  createdAt: string;
};

export type ProjectCreditNoteDocument = {
  kind: 'ABONO';
  creditNoteId: string;
  creditNoteNumber: string;
  status: ProjectCreditNoteStatus;
  createdAt: string;
};

export type ProjectDocuments = {
  presupuesto?: ProjectQuoteDocument;
  pedido?: ProjectOrderDocument;
  albaran?: ProjectDeliveryNoteDocument;
  factura?: ProjectInvoiceDocument;
  abono?: ProjectCreditNoteDocument;
};

export type ProjectEntity = {
  id: string;
  customerId?: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  documents: ProjectDocuments;
  workOrder?: ProjectWorkOrder;
};

export type ProjectDocumentRow = {
  rowId: string;
  projectId: string;
  quoteId: string | null;
  customerName: string;
  type: ProjectDocumentKind;
  number: string;
  statusLabel: string;
  createdAt: string;
  workOrderStep?: WorkOrderWorkflowStep;
};
