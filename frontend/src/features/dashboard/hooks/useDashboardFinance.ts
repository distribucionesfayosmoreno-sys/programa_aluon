import { useEffect, useMemo, useState } from 'react';
import { dashboardEndpoints } from './dashboardApi';
import type { DashboardTimeRange } from '../Dashboard.types';

type FinanceSlice = {
  id: string;
  label: string;
  value: number;
};

type FinanceDonut = {
  title: string;
  total: number;
  slices: FinanceSlice[];
};

type FinanceTile = {
  id: string;
  label: string;
  amount: number;
};

type FinanceTrendPoint = {
  day: string; // ISO date
  value: number;
};

type FinanceTrend = {
  label: string;
  points: FinanceTrendPoint[];
};

type FinanceTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  day: string; // ISO date
  tone: 'in' | 'out';
};

type FinanceBar = {
  id: string;
  label: string;
  value: number;
};

type FinanceHistogramRow = {
  id: string;
  label: string;
  value: number;
};

type DashboardFinanceResponse = {
  income: FinanceDonut;
  expenses: FinanceDonut;
  tiles: FinanceTile[];
  trend: FinanceTrend;
  transactions: FinanceTransaction[];
  paymentIssues: FinanceBar[];
  histogram: FinanceHistogramRow[];
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const toQueryRange = (range: DashboardTimeRange) => range.toUpperCase();

export const useDashboardFinance = (range: DashboardTimeRange) => {
  const [data, setData] = useState<DashboardFinanceResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const url = new URL(dashboardEndpoints.finance, window.location.origin);
        url.searchParams.set('range', toQueryRange(range));

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Dashboard finance fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardFinanceResponse;
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

  const finance = useMemo(() => {
    return data ?? {
      income: { title: 'Income', total: 0, slices: [] },
      expenses: { title: 'Expenses', total: 0, slices: [] },
      tiles: [],
      trend: { label: '', points: [] },
      transactions: [],
      paymentIssues: [],
      histogram: [],
    };
  }, [data]);

  return { finance, status };
};
