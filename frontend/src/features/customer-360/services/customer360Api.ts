import type { Customer } from '../../../hooks/useCustomers';
import { fetchDocumentManagementRows } from '../../project-management/services/documentManagementApi';
import { fetchOrderStatuses, type OrderStatusApi } from '../../project-management/services/ordersApi';
import { projectStore } from '../../project-management/services/projectStore';
import type { Customer360Data, Customer360DocumentItem, Customer360Metrics, Customer360WorkOrderItem } from '../customer360Types';

type DocumentManagementRow = Awaited<ReturnType<typeof fetchDocumentManagementRows>>[number];

const normalizeText = (value: string | null | undefined): string =>
  (value ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const matchesCustomerName = (rowName: string, customer: Customer): boolean => {
  const normalizedRowName = normalizeText(rowName);
  if (!normalizedRowName) return false;

  const candidates = [
    customer.nombreComercial,
    customer.razonSocial,
    customer.personaContacto,
  ]
    .map(normalizeText)
    .filter(Boolean);

  return candidates.some(candidate =>
    normalizedRowName === candidate
    || normalizedRowName.includes(candidate)
    || candidate.includes(normalizedRowName),
  );
};

const mapBackendDocument = (row: DocumentManagementRow): Customer360DocumentItem => ({
  id: row.rowId,
  type: row.type,
  number: row.number,
  statusLabel: row.statusLabel,
  createdAt: row.createdAt,
  quoteId: row.quoteId,
  customerName: row.customerName,
  source: 'backend',
});

const mapLocalDocument = (
  customerName: string,
  id: string,
  type: Customer360DocumentItem['type'],
  number: string,
  statusLabel: string,
  createdAt: string,
  quoteId: string | null,
): Customer360DocumentItem => ({
  id,
  type,
  number,
  statusLabel,
  createdAt,
  quoteId,
  customerName,
  source: 'local',
});

const collectLocalDocuments = (customer: Customer): Customer360DocumentItem[] => {
  const projects = projectStore.list();
  const customerId = customer.id ?? '';
  const customerName = customer.nombreComercial || customer.razonSocial || '';

  return projects
    .filter(project => {
      if (customerId && project.customerId === customerId) return true;
      return matchesCustomerName(project.customerName, customer);
    })
    .flatMap(project => {
      const docs = project.documents;
      const quoteId = docs.presupuesto?.quoteId ?? project.id;
      const baseName = project.customerName || customerName;
      const items: Customer360DocumentItem[] = [];

      if (docs.presupuesto) {
        items.push(mapLocalDocument(baseName, `${project.id}:PRESUPUESTO`, 'PRESUPUESTO', docs.presupuesto.quoteNumber, docs.presupuesto.status, docs.presupuesto.createdAt, docs.presupuesto.quoteId));
      }
      if (docs.pedido) {
        items.push(mapLocalDocument(baseName, `${project.id}:PEDIDO`, 'PEDIDO', docs.pedido.orderNumber, docs.pedido.status, docs.pedido.createdAt, quoteId));
      }
      if (docs.albaran) {
        items.push(mapLocalDocument(baseName, `${project.id}:ALBARAN`, 'ALBARAN', docs.albaran.deliveryNoteNumber, docs.albaran.status, docs.albaran.createdAt, quoteId));
      }
      if (docs.factura) {
        items.push(mapLocalDocument(baseName, `${project.id}:FACTURA`, 'FACTURA', docs.factura.invoiceNumber, docs.factura.status, docs.factura.createdAt, quoteId));
      }
      if (docs.abono) {
        items.push(mapLocalDocument(baseName, `${project.id}:ABONO`, 'ABONO', docs.abono.creditNoteNumber, docs.abono.status, docs.abono.createdAt, quoteId));
      }

      return items;
    });
};

const mapWorkOrder = (row: OrderStatusApi): Customer360WorkOrderItem => ({
  id: row.id,
  customerName: row.customerName,
  code: row.codigoOrden,
  statusLabel: row.estado,
  workflowStep: row.workflowStage ?? row.workflowStep,
  createdAt: row.requestDate ?? new Date().toISOString(),
});

const isOpenWorkOrder = (item: Customer360WorkOrderItem): boolean =>
  !['FINALIZADO', 'FINAL', 'CERRADO', 'COMPLETADO'].includes(item.statusLabel.toUpperCase());

const countByType = (documents: Customer360DocumentItem[], type: Customer360DocumentItem['type']): number =>
  documents.filter(item => item.type === type).length;

const countInvoiceStatus = (documents: Customer360DocumentItem[], status: 'PAGADA' | 'PENDIENTE'): number => {
  if (status === 'PAGADA') {
    return documents.filter(item => item.type === 'FACTURA' && item.statusLabel.toUpperCase() === 'PAGADA').length;
  }
  return documents.filter(item => item.type === 'FACTURA' && item.statusLabel.toUpperCase() !== 'PAGADA' && item.statusLabel.toUpperCase() !== 'ANULADA').length;
};

const countDeliveryNoteStatus = (documents: Customer360DocumentItem[], status: 'FACTURADO' | 'PENDIENTE'): number => {
  if (status === 'FACTURADO') {
    return documents.filter(item => item.type === 'ALBARAN' && item.statusLabel.toUpperCase() === 'FACTURADO').length;
  }
  return documents.filter(item => item.type === 'ALBARAN' && item.statusLabel.toUpperCase() !== 'FACTURADO').length;
};

const buildMetrics = (documents: Customer360DocumentItem[], workOrders: Customer360WorkOrderItem[]): Customer360Metrics => ({
  totalDocuments: documents.length,
  budgets: countByType(documents, 'PRESUPUESTO'),
  orders: countByType(documents, 'PEDIDO'),
  deliveryNotes: countByType(documents, 'ALBARAN'),
  invoices: countByType(documents, 'FACTURA'),
  creditNotes: countByType(documents, 'ABONO'),
  pendingInvoices: countInvoiceStatus(documents, 'PENDIENTE'),
  paidInvoices: countInvoiceStatus(documents, 'PAGADA'),
  pendingDeliveryNotes: countDeliveryNoteStatus(documents, 'PENDIENTE'),
  billedDeliveryNotes: countDeliveryNoteStatus(documents, 'FACTURADO'),
  openWorkOrders: workOrders.filter(isOpenWorkOrder).length,
  closedWorkOrders: workOrders.filter(item => !isOpenWorkOrder(item)).length,
});

const dedupeDocuments = (documents: Customer360DocumentItem[]): Customer360DocumentItem[] => {
  const seen = new Set<string>();
  return documents.filter(item => {
    const key = `${item.type}:${item.number}:${normalizeText(item.customerName)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const loadCustomer360Data = async (customer: Customer): Promise<Customer360Data> => {
  const [backendDocuments, orderStatuses] = await Promise.all([
    fetchDocumentManagementRows(),
    fetchOrderStatuses(),
  ]);

  const backendMatches = backendDocuments
    .filter(row => matchesCustomerName(row.customerName, customer))
    .map(mapBackendDocument);

  const localDocuments = collectLocalDocuments(customer);

  const documents = dedupeDocuments([
    ...backendMatches,
    ...localDocuments,
  ]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const workOrders = orderStatuses
    .filter(row => matchesCustomerName(row.customerName, customer))
    .map(mapWorkOrder)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    customer,
    deliveryAddresses: customer.direccionesEntrega ?? [],
    documents,
    workOrders,
    metrics: buildMetrics(documents, workOrders),
  };
};

