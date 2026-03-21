import { useEffect, useState } from 'react';
import { dashboardEndpoints } from './dashboardApi';

type DashboardOperationsResponse = {
  inRoute: number;
  completed: number;
  avgTimeMinutes: number;
  updatedAt?: string;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const mockResponse: DashboardOperationsResponse = {
  inRoute: 6,
  completed: 18,
  avgTimeMinutes: 38,
};

export const useDashboardOperations = () => {
  const [data, setData] = useState<DashboardOperationsResponse | null>(null);
  const [status, setStatus] = useState<LoadState>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      try {
        const response = await fetch(dashboardEndpoints.operations, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Dashboard operations fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardOperationsResponse;
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

  const source = data ?? mockResponse;

  return {
    status,
    data: {
      inRoute: source.inRoute,
      completed: source.completed,
      avgTimeMinutes: source.avgTimeMinutes,
    },
  };
};
