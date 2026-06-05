import type { ProjectDocumentKind, ProjectDocumentRow } from '../ProjectManagement.types';

export type ManualDocumentUpdateRequest = {
  customerName: string;
  type: Exclude<ProjectDocumentKind, 'PRESUPUESTO'>;
  number: string;
};

type ManualDocumentRowApi = {
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

const mapRow = (row: ManualDocumentRowApi): ProjectDocumentRow => ({
  rowId: row.rowId,
  projectId: row.projectId,
  quoteId: row.quoteId,
  customerName: row.customerName,
  type: row.type,
  number: row.number,
  statusLabel: row.statusLabel,
  createdAt: row.createdAt,
});

export const patchManualDocument = async (
  id: string,
  payload: ManualDocumentUpdateRequest,
): Promise<ProjectDocumentRow> => {
  const response = await fetch(`/api/document-management/manual-documents/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const row = await parseJsonOrThrow<ManualDocumentRowApi>(response);
  return mapRow(row);
};
