import { useEffect, useMemo, useState } from 'react';
import { dashboardEndpoints } from './dashboardApi';

type DashboardKpisResponse = {
  ordersToPrepare: number;
  monthlyBilling: number;
  criticalStockAlerts: number;
  crmTasksToday: number;
  updatedAt?: string;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

export type DashboardKpisView = {
  label: string;
  value: string;
  trend: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
};

export const useDashboardKpis = () => {
  const [data, setData] = useState<DashboardKpisResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const response = await fetch(dashboardEndpoints.kpis, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Dashboard KPI fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardKpisResponse;

        if (!active) return;
        setData(payload);
        setLastUpdated(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
        setStatus('ready');
      } catch (error) {
        if (!active) return;
        setData(null);
        setLastUpdated(null);
        setStatus('error');
      }
    };

    load();
    const interval = window.setInterval(load, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const kpis: DashboardKpisView[] = useMemo(() => {
    const source = data ?? {
      ordersToPrepare: 0,
      monthlyBilling: 0,
      criticalStockAlerts: 0,
      crmTasksToday: 0,
    };
    return [
      {
        label: 'Pedidos por preparar',
        value: String(source.ordersToPrepare),
        trend: '+3 vs ayer',
        tone: source.ordersToPrepare > 10 ? 'warning' : 'neutral',
      },
      {
        label: 'Facturación del mes',
        value: formatCurrency(source.monthlyBilling),
        trend: '+8.4% vs feb',
        tone: 'success',
      },
      {
        label: 'Alertas de stock crítico',
        value: String(source.criticalStockAlerts),
        trend: source.criticalStockAlerts > 0 ? '2 urgentes' : 'Sin alertas',
        tone: source.criticalStockAlerts > 0 ? 'danger' : 'neutral',
      },
      {
        label: 'Tareas CRM para hoy',
        value: String(source.crmTasksToday),
        trend: '4 próximas 2h',
        tone: 'neutral',
      },
    ];
  }, [data]);

  return {
    kpis,
    status,
    lastUpdated,
  };
};
