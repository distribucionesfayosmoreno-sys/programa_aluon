import { useEffect, useMemo, useState } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import type {
  DocumentDrawerData,
  QuoteLifecycleNumbersResponse,
} from './DocumentDrawer.types';
import { fetchLifecycleNumbers, fetchQuoteById, listQuoteDocuments } from '../services/quoteDetailsApi';

const VAT_RATE_DEFAULT = 0.21;

const sumNumbers = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

const toDocTypeLabel = (kind: ProjectDocumentRow['type']): string => {
  switch (kind) {
    case 'PRESUPUESTO':
      return 'Presupuesto';
    case 'PEDIDO':
      return 'Pedido';
    case 'ALBARAN':
      return 'Albarán';
    case 'FACTURA':
      return 'Factura';
    case 'ABONO':
      return 'Abono';
    default:
      return kind;
  }
};

const resolveDocNumber = (kind: ProjectDocumentRow['type'], lifecycle: QuoteLifecycleNumbersResponse): string => {
  switch (kind) {
    case 'PRESUPUESTO':
      return lifecycle.presupuesto;
    case 'PEDIDO':
      return lifecycle.pedido;
    case 'ALBARAN':
      return lifecycle.albaran;
    case 'FACTURA':
      return lifecycle.factura;
    case 'ABONO':
      return lifecycle.abono;
    default:
      return lifecycle.presupuesto;
  }
};

export const useDocumentDrawer = (row: ProjectDocumentRow | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<DocumentDrawerData | null>(null);

  useEffect(() => {
    if (!row) {
      setLoading(false);
      setError('');
      setData(null);
      return;
    }

    if (!row.quoteId) {
      setLoading(false);
      setError('');
      setData({
        kind: 'manual',
        document: {
          id: row.projectId,
          rowId: row.projectId,
          customerName: row.customerName,
          type: row.type,
          number: row.number,
          statusLabel: row.statusLabel,
          createdAt: row.createdAt,
        },
      });
      return;
    }

    const quoteId = row.quoteId;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);

    const run = async () => {
      try {
        const [quote, lifecycle, existingDocuments] = await Promise.all([
          fetchQuoteById(quoteId, controller.signal),
          fetchLifecycleNumbers(quoteId, controller.signal),
          listQuoteDocuments(quoteId, controller.signal),
        ]);

        const items = quote.items ?? [];
        const subtotal = sumNumbers(items.map(item => item.lineTotal));
        const vatRate = VAT_RATE_DEFAULT;
        const vatAmount = Math.round(subtotal * vatRate * 100) / 100;
        const total = Math.round((subtotal + vatAmount) * 100) / 100;

        const docTypeLabel = toDocTypeLabel(row.type);
        const docNumber = resolveDocNumber(row.type, lifecycle);

        setData({
          kind: 'quote',
          quote,
          lifecycle,
          existingDocuments,
          items,
          totals: { subtotal, vatRate, vatAmount, total },
          docTypeLabel,
          docNumber,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el documento.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void run();
    return () => controller.abort();
  }, [row]);

  const title = useMemo(() => {
    if (!row) return '';
    return `${toDocTypeLabel(row.type)} · ${row.number}`;
  }, [row]);

  return { title, loading, error, data } as const;
};
