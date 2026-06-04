import type { ProjectDocumentKind, ProjectDocumentRow } from '../ProjectManagement.types';

export type DocumentManagementRowsParams = Partial<{
  query: string;
  type: ProjectDocumentKind | 'ALL';
  status: string | 'ALL';
  dateFrom: string;
  dateTo: string;
}>;

export type DocumentManagementCreatableType = Exclude<ProjectDocumentKind, 'PRESUPUESTO'>;

export type DocumentManagementCreateRequest = {
  customerName: string;
  type: DocumentManagementCreatableType;
  number: string;
};

type DocumentManagementRowApi = {
  rowId: string;
  projectId: string;
  quoteId: string | null;
  customerName: string;
  type: ProjectDocumentKind;
  number: string;
  statusLabel: string;
  createdAt: string;
};

const parseJsonOrThrow = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return (await response.json()) as T;
};

const buildQuery = (params: DocumentManagementRowsParams): string => {
  const sp = new URLSearchParams();
  if (params.query) sp.set('query', params.query);
  if (params.type && params.type !== 'ALL') sp.set('type', params.type);
  if (params.status && params.status !== 'ALL') sp.set('status', params.status);
  if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
  if (params.dateTo) sp.set('dateTo', params.dateTo);
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
};

const mapRow = (r: DocumentManagementRowApi): ProjectDocumentRow => ({
  rowId: r.rowId,
  projectId: r.projectId,
  quoteId: r.quoteId,
  customerName: r.customerName,
  type: r.type,
  number: r.number,
  statusLabel: r.statusLabel,
  createdAt: r.createdAt,
});

export const fetchDocumentManagementRows = async (params: DocumentManagementRowsParams = {}): Promise<ProjectDocumentRow[]> => {
  const response = await fetch(`/api/document-management/rows${buildQuery(params)}`);
  const rows = await parseJsonOrThrow<DocumentManagementRowApi[]>(response);
  return rows.map(mapRow);
};

export const createDocumentManagementDocument = async (
  payload: DocumentManagementCreateRequest,
): Promise<ProjectDocumentRow> => {
  const response = await fetch('/api/document-management/rows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const row = await parseJsonOrThrow<DocumentManagementRowApi>(response);
  return mapRow(row);
};
