import { useEffect, useState } from 'react';
import { dashboardEndpoints } from './dashboardApi';

type DashboardAlert = {
  title: string;
  detail: string;
  tone?: 'neutral' | 'warning' | 'danger';
};

type DashboardAlertsResponse = {
  alerts: DashboardAlert[];
  updatedAt?: string;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const mockResponse: DashboardAlertsResponse = {
  alerts: [
    { title: 'Bombín 30/30', detail: 'Stock crítico (2 uds)', tone: 'danger' },
    { title: 'Factura #F-1203', detail: 'Pendiente de pago 15 días', tone: 'warning' },
    { title: 'Cliente BBVA', detail: 'Nueva solicitud prioritaria', tone: 'neutral' },
  ],
};

export const useDashboardAlerts = () => {
  const [data, setData] = useState<DashboardAlertsResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const response = await fetch(dashboardEndpoints.alerts, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Dashboard alerts fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardAlertsResponse;
        if (!active) return;
        setData(payload);
        setStatus('ready');
      } catch (error) {
        if (!active) return;
        setData(mockResponse);
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

  return {
    status,
    alerts: (data ?? mockResponse).alerts,
  };
};
