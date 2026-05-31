import type { QuoteResponse } from '../../customer-onboarding/models';
import type {
  ProjectEntity,
  ProjectOrderDocument,
  ProjectQuoteDocument,
  WorkOrderWorkflowStep,
} from '../ProjectManagement.types';
import { emitProjectsChanged } from './projectEvents';

const STORAGE_KEY = 'aluon.project-management.v1';

const nowIso = () => new Date().toISOString();

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isProjectEntity = (value: unknown): value is ProjectEntity => {
  if (!isRecord(value)) return false;
  if (!isString(value.id)) return false;
  if (!isString(value.customerName)) return false;
  if (!isString(value.createdAt) || !isString(value.updatedAt)) return false;
  if (!isRecord(value.documents)) return false;
  return true;
};

const readAll = (): ProjectEntity[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParseJson(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isProjectEntity);
};

const writeAll = (projects: ProjectEntity[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  emitProjectsChanged();
};

const upsert = (project: ProjectEntity): void => {
  const existing = readAll();
  const next = [
    project,
    ...existing.filter(item => item.id !== project.id),
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  writeAll(next);
};

const formatQuotePdfUrl = (quoteId: string) => `/api/quotes/${encodeURIComponent(quoteId)}/pdf`;

const buildQuoteDocument = (quote: QuoteResponse): ProjectQuoteDocument => ({
  kind: 'PRESUPUESTO',
  quoteId: quote.id,
  quoteNumber: quote.quoteNumber,
  status: quote.status,
  total: quote.total,
  createdAt: quote.createdAt,
  validatedAt: quote.validatedAt ?? null,
  pdfUrl: formatQuotePdfUrl(quote.id),
});

const generateSequenceNumber = (prefix: string): string => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rnd = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${date}-${rnd}`;
};

export const projectStore = {
  list(): ProjectEntity[] {
    return readAll();
  },

  getById(projectId: string): ProjectEntity | null {
    const projects = readAll();
    return projects.find(item => item.id === projectId) ?? null;
  },

  upsertFromQuote(quote: QuoteResponse): void {
    const projects = readAll();
    const existing = projects.find(item => item.id === quote.id);
    const createdAt = existing?.createdAt ?? quote.createdAt ?? nowIso();
    const next: ProjectEntity = {
      id: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      createdAt,
      updatedAt: nowIso(),
      documents: {
        ...existing?.documents,
        presupuesto: buildQuoteDocument(quote),
      },
      workOrder: existing?.workOrder,
    };
    upsert(next);
  },

  approveQuoteToOrder(projectId: string): ProjectEntity | null {
    const projects = readAll();
    const existing = projects.find(item => item.id === projectId);
    if (!existing?.documents.presupuesto) return null;
    if (existing.documents.pedido) return existing;

    const orderId = `order_${crypto.randomUUID()}`;
    const pedido: ProjectOrderDocument = {
      kind: 'PEDIDO',
      orderId,
      orderNumber: generateSequenceNumber('P'),
      status: 'EN_ORDEN_TRABAJO',
      createdAt: nowIso(),
    };

    const next: ProjectEntity = {
      ...existing,
      updatedAt: nowIso(),
      documents: {
        ...existing.documents,
        pedido,
      },
      workOrder: {
        orderId,
        workflowStep: 'INBOX',
        updatedAt: nowIso(),
      },
    };
    upsert(next);
    return next;
  },

  updateWorkOrderStep(projectId: string, step: WorkOrderWorkflowStep): ProjectEntity | null {
    const projects = readAll();
    const existing = projects.find(item => item.id === projectId);
    if (!existing?.workOrder) return null;
    const next: ProjectEntity = {
      ...existing,
      updatedAt: nowIso(),
      workOrder: {
        ...existing.workOrder,
        workflowStep: step,
        updatedAt: nowIso(),
      },
    };
    upsert(next);
    return next;
  },

  finalizeWorkOrderToDeliveryNote(projectId: string): ProjectEntity | null {
    const projects = readAll();
    const existing = projects.find(item => item.id === projectId);
    if (!existing?.documents.pedido) return null;
    if (existing.documents.albaran) return existing;

    const next: ProjectEntity = {
      ...existing,
      updatedAt: nowIso(),
      documents: {
        ...existing.documents,
        albaran: {
          kind: 'ALBARAN',
          deliveryNoteId: `dn_${crypto.randomUUID()}`,
          deliveryNoteNumber: generateSequenceNumber('A'),
          status: 'EMITIDO',
          createdAt: nowIso(),
        },
      },
      workOrder: existing.workOrder
        ? { ...existing.workOrder, workflowStep: 'FINAL', updatedAt: nowIso() }
        : undefined,
    };
    upsert(next);
    return next;
  },

  invoiceFromDeliveryNote(projectId: string): ProjectEntity | null {
    const projects = readAll();
    const existing = projects.find(item => item.id === projectId);
    if (!existing?.documents.albaran) return null;
    if (existing.documents.factura) return existing;

    const next: ProjectEntity = {
      ...existing,
      updatedAt: nowIso(),
      documents: {
        ...existing.documents,
        albaran: { ...existing.documents.albaran, status: 'FACTURADO' },
        factura: {
          kind: 'FACTURA',
          invoiceId: `inv_${crypto.randomUUID()}`,
          invoiceNumber: generateSequenceNumber('F'),
          status: 'EMITIDA',
          createdAt: nowIso(),
        },
      },
    };
    upsert(next);
    return next;
  },

  createCreditNote(projectId: string): ProjectEntity | null {
    const projects = readAll();
    const existing = projects.find(item => item.id === projectId);
    if (!existing?.documents.factura) return null;
    if (existing.documents.abono) return existing;

    const next: ProjectEntity = {
      ...existing,
      updatedAt: nowIso(),
      documents: {
        ...existing.documents,
        abono: {
          kind: 'ABONO',
          creditNoteId: `cn_${crypto.randomUUID()}`,
          creditNoteNumber: generateSequenceNumber('AB'),
          status: 'EMITIDO',
          createdAt: nowIso(),
        },
      },
    };
    upsert(next);
    return next;
  },
} as const;
