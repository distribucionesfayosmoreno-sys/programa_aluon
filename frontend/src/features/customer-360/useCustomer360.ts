import { useEffect, useState } from 'react';
import type { Customer } from '../../hooks/useCustomers';
import { loadCustomer360Data } from './services/customer360Api';
import type { Customer360Data } from './customer360Types';

type UseCustomer360Params = {
  customer: Customer | null;
  open: boolean;
};

export const useCustomer360 = ({ customer, open }: UseCustomer360Params) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<Customer360Data | null>(null);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError('');
      setData(null);
      return;
    }

    if (!customer?.id) {
      setLoading(false);
      setError('Este cliente no tiene identificador aún. Guarda el cliente antes de abrir Vision 360.');
      setData(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');

    void (async () => {
      try {
        const next = await loadCustomer360Data(customer);
        if (controller.signal.aborted) return;
        setData(next);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar Vision 360.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [customer, open]);

  return { loading, error, data } as const;
};

