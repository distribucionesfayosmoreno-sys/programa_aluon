import type { ErpBudgetStatusResponse, QuoteStatus } from '../models';

export type ErpBudgetSyncRequest = {
  quoteNumber: string;
  status: QuoteStatus;
};

export const getErpBudgetStatus = async (quoteNumber: string): Promise<ErpBudgetStatusResponse> => {
  const response = await fetch(`/api/erp/budgets/${encodeURIComponent(quoteNumber)}/status`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al consultar el estado del presupuesto');
  }
  return response.json() as Promise<ErpBudgetStatusResponse>;
};

export const syncErpBudgetStatus = async (payload: ErpBudgetSyncRequest): Promise<ErpBudgetStatusResponse> => {
  const response = await fetch('/api/erp/budgets/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al sincronizar el presupuesto');
  }
  return response.json() as Promise<ErpBudgetStatusResponse>;
};
