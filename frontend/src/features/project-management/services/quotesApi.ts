import type { QuoteResponse } from '../../customer-onboarding/models';

export const validateQuote = async (id: string): Promise<QuoteResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(id)}/validate`, { method: 'POST' });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo validar el presupuesto.');
  }
  return (await response.json()) as QuoteResponse;
};

