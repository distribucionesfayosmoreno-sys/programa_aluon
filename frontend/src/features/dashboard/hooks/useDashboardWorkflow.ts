import { useEffect, useMemo, useState } from 'react';
import { dashboardEndpoints } from './dashboardApi';
import type { DashboardTimeRange } from '../Dashboard.types';

type QuoteStatus = 'PENDIENTE_VALIDACION' | 'VALIDADO' | 'ENVIADO';
type OrderWorkflowStep = 'INBOX' | 'REQUEST' | 'BUDGET' | 'VALIDATION' | 'DEV' | 'PROD' | 'FINAL';
type OrderStatus = 'PENDIENTE_MATERIAL' | 'PRESUPUESTO' | 'EN_PRODUCCION' | 'LISTO_MONTAJE' | 'INSTALADA' | 'FACTURADA';

type BudgetCount = { status: QuoteStatus; count: number };
type BudgetRow = { quoteNumber: string; status: QuoteStatus; customerName: string; total: number; createdAt: string };

type OrderStepCount = { step: OrderWorkflowStep; count: number };
type OrderStatusCount = { status: OrderStatus; count: number };
type OrderRow = {
  codigoOrden: string;
  status: OrderStatus;
  workflowStage: string;
  customerName: string;
  createdAt: string;
  assignedUserName: string | null;
};

type DashboardWorkflowResponse = {
  updatedAt: string;
  budgets: { counts: BudgetCount[]; recent: BudgetRow[] };
  orders: { byStep: OrderStepCount[]; byStatus: OrderStatusCount[]; recent: OrderRow[] };
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const toQueryRange = (range: DashboardTimeRange) => range.toUpperCase();

export const useDashboardWorkflow = (range: DashboardTimeRange) => {
  const [data, setData] = useState<DashboardWorkflowResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const url = new URL(dashboardEndpoints.workflow, window.location.origin);
        url.searchParams.set('range', toQueryRange(range));

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Dashboard workflow fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardWorkflowResponse;
        if (!active) return;
        setData(payload);
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
  }, [range]);

  const workflow = useMemo(() => {
    return data ?? {
      updatedAt: '',
      budgets: { counts: [], recent: [] },
      orders: { byStep: [], byStatus: [], recent: [] },
    };
  }, [data]);

  return { workflow, status };
};

