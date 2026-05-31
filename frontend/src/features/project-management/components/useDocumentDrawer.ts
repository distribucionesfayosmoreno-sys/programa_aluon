import { useEffect, useMemo, useState } from 'react';
import type { DocumentDrawerData, DocumentDrawerRow, QuoteLifecycleNumbersResponse } from './DocumentDrawer.types';
import { fetchLifecycleNumbers, fetchQuoteById, listQuoteDocuments } from '../services/quoteDetailsApi';

const VAT_RATE_DEFAULT = 0.21;

const sumNumbers = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

const toDocTypeLabel = (kind: DocumentDrawerRow['kind']): string => {
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

const resolveDocNumber = (kind: DocumentDrawerRow['kind'], lifecycle: QuoteLifecycleNumbersResponse): string => {
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

export const useDocumentDrawer = (row: DocumentDrawerRow | null) => {
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

    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);

    const run = async () => {
      try {
        const [quote, lifecycle, existingDocuments] = await Promise.all([
          fetchQuoteById(row.quoteId, controller.signal),
          fetchLifecycleNumbers(row.quoteId, controller.signal),
          listQuoteDocuments(row.quoteId, controller.signal),
        ]);

        const items = quote.items ?? [];
        const subtotal = sumNumbers(items.map(item => item.lineTotal));
        const vatRate = VAT_RATE_DEFAULT;
        const vatAmount = Math.round(subtotal * vatRate * 100) / 100;
        const total = Math.round((subtotal + vatAmount) * 100) / 100;

        const docTypeLabel = toDocTypeLabel(row.kind);
        const docNumber = resolveDocNumber(row.kind, lifecycle);

        setData({
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
    return `${toDocTypeLabel(row.kind)} · ${row.number}`;
  }, [row]);

  return { title, loading, error, data } as const;
};
