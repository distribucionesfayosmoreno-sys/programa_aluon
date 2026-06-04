import { useEffect, useMemo, useState } from 'react';
import type { DashboardDocumentRow, DashboardTimeRange } from '../Dashboard.types';
import { fetchDocumentManagementRows } from '../../project-management/services/documentManagementApi';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

type DashboardDocumentsResponse = {
  albaranes: DashboardDocumentRow[];
  facturas: DashboardDocumentRow[];
};

export const useDashboardDocuments = (_range: DashboardTimeRange) => {
  const [data, setData] = useState<DashboardDocumentsResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const rows = await fetchDocumentManagementRows();
        if (!active) return;

        const mapped = rows.map<DashboardDocumentRow>(row => ({
          id: row.rowId,
          type: row.type,
          number: row.number,
          customerName: row.customerName,
          statusLabel: row.statusLabel,
          createdAt: row.createdAt,
          quoteId: row.quoteId,
        }));

        const now = new Date();
        const rangeStart = (() => {
          const start = new Date(now);
          switch (_range) {
            case 'day':
              start.setHours(0, 0, 0, 0);
              return start;
            case 'week':
              start.setDate(start.getDate() - 7);
              return start;
            case 'month':
              start.setMonth(start.getMonth() - 1);
              return start;
            case 'year':
              start.setFullYear(start.getFullYear() - 1);
              return start;
            default:
              return start;
          }
        })();

        const inRange = (row: DashboardDocumentRow) => {
          const date = new Date(row.createdAt);
          return !Number.isNaN(date.getTime()) && date >= rangeStart;
        };

        const albaranes = mapped
          .filter(row => row.type === 'ALBARAN')
          .filter(inRange)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5);
        const facturas = mapped
          .filter(row => row.type === 'FACTURA')
          .filter(inRange)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5);

        setData({ albaranes, facturas });
        setStatus('ready');
      } catch {
        if (!active) return;
        setData(null);
        setStatus('error');
      }
    };

    load();
    const interval = window.setInterval(load, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [_range]);

  const documents = useMemo(
    () => data ?? { albaranes: [], facturas: [] },
    [data],
  );

  return { documents, status } as const;
};
