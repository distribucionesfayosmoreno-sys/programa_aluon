import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ProjectDocumentKind, ProjectDocumentRow } from '../ProjectManagement.types';
import { patchManualDocument } from '../services/manualDocumentsApi';

const editableKinds: Array<Exclude<ProjectDocumentKind, 'PRESUPUESTO'>> = ['PEDIDO', 'ALBARAN', 'FACTURA', 'ABONO'];

export type ManualDocumentDraft = {
  customerName: string;
  type: Exclude<ProjectDocumentKind, 'PRESUPUESTO'>;
  number: string;
};

const toDraft = (row: ProjectDocumentRow): ManualDocumentDraft => ({
  customerName: row.customerName,
  type: editableKinds.includes(row.type as Exclude<ProjectDocumentKind, 'PRESUPUESTO'>)
    ? (row.type as Exclude<ProjectDocumentKind, 'PRESUPUESTO'>)
    : 'PEDIDO',
  number: row.number,
});

export const useManualDocumentDrawerEdit = (row: ProjectDocumentRow | null) => {
  const initial = useMemo(() => (row ? toDraft(row) : null), [row]);
  const [draft, setDraft] = useState<ManualDocumentDraft | null>(initial);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setDraft(initial);
    setSaveError('');
    setSaving(false);
  }, [initial]);

  const patch = useCallback((next: Partial<ManualDocumentDraft>) => {
    setDraft(prev => (prev ? { ...prev, ...next } : prev));
  }, []);

  const reset = useCallback(() => {
    setDraft(initial);
    setSaveError('');
  }, [initial]);

  const save = useCallback(async () => {
    if (!row || !draft) return null;
    setSaving(true);
    setSaveError('');
    try {
      return await patchManualDocument(row.projectId, {
        customerName: draft.customerName.trim(),
        type: draft.type,
        number: draft.number.trim(),
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [draft, row]);

  return {
    draft,
    patch,
    reset,
    save,
    saving,
    saveError,
  } as const;
};
