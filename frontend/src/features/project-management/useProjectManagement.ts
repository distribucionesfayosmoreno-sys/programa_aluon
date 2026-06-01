import { useEffect, useMemo, useState } from 'react';
import type { ProjectDocumentRow, WorkOrderWorkflowStep } from './ProjectManagement.types';
import { fetchOrderStatuses } from './services/ordersApi';
import { ensureQuotePdfGenerated, quotePdfUrl } from './services/quotePdf';
import { fetchDocumentManagementRows } from './services/documentManagementApi';

export const useProjectManagement = () => {
  const [documentRows, setDocumentRows] = useState<ProjectDocumentRow[]>([]);
  const [orderDocs, setOrderDocs] = useState<ProjectDocumentRow[]>([]);
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setError('');
        const rows = await fetchDocumentManagementRows();
        if (!cancelled) setDocumentRows(rows);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'No se pudo cargar Gestión Documentos.');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      try {
        const orders = await fetchOrderStatuses();
        if (cancelled) return;
        const mapped: ProjectDocumentRow[] = orders.map(order => ({
          rowId: `order:${order.id}`,
          projectId: `order:${order.id}`,
          quoteId: null,
          customerName: order.customerName,
          type: 'PEDIDO',
          number: order.codigoOrden,
          statusLabel: order.estado,
          createdAt: (order.requestDate ?? new Date().toISOString()).slice(0, 10),
          workOrderStep: (order.workflowStage as WorkOrderWorkflowStep)
            ?? (order.workflowStep as WorkOrderWorkflowStep)
            ?? undefined,
        }));
        setOrderDocs(mapped);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudieron cargar las órdenes de trabajo.');
        }
      }
    };
    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      [...documentRows, ...orderDocs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [documentRows, orderDocs],
  );

  const openPdf = async (row: ProjectDocumentRow) => {
    setBusyProjectId(row.projectId);
    setError('');
    try {
      if (!row.quoteId) {
        throw new Error('No se puede abrir el documento porque no está vinculado a un presupuesto.');
      }

      if (row.type === 'PRESUPUESTO') {
        await ensureQuotePdfGenerated(row.quoteId);
        window.open(quotePdfUrl(row.quoteId), '_blank', 'noopener,noreferrer');
        return;
      }

      const pdfUrl = `/api/quotes/${encodeURIComponent(row.quoteId)}/pdf?type=${encodeURIComponent(row.type)}&number=${encodeURIComponent(row.number)}`;
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el PDF.');
    } finally {
      setBusyProjectId(null);
    }
  };

  return {
    rows,
    busyProjectId,
    error,
    actions: {
      openPdf,
    },
  } as const;
};
