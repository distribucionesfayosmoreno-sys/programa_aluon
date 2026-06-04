import type { Customer, DeliveryAddress } from '../../hooks/useCustomers';
import type { ProjectDocumentKind } from '../project-management/ProjectManagement.types';

export type Customer360DocumentSource = 'backend' | 'local';

export type Customer360DocumentType = ProjectDocumentKind;

export type Customer360DocumentItem = {
  id: string;
  type: Customer360DocumentType;
  number: string;
  statusLabel: string;
  createdAt: string;
  quoteId: string | null;
  customerName: string;
  source: Customer360DocumentSource;
};

export type Customer360WorkOrderItem = {
  id: string;
  customerName: string;
  code: string;
  statusLabel: string;
  workflowStep?: string;
  createdAt: string;
};

export type Customer360Metrics = {
  totalDocuments: number;
  budgets: number;
  orders: number;
  deliveryNotes: number;
  invoices: number;
  creditNotes: number;
  pendingInvoices: number;
  paidInvoices: number;
  pendingDeliveryNotes: number;
  billedDeliveryNotes: number;
  openWorkOrders: number;
  closedWorkOrders: number;
};

export type Customer360Data = {
  customer: Customer;
  deliveryAddresses: DeliveryAddress[];
  documents: Customer360DocumentItem[];
  workOrders: Customer360WorkOrderItem[];
  metrics: Customer360Metrics;
};
