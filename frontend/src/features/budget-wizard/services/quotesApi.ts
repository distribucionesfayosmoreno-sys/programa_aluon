import type { QuoteResponse } from '../../customer-onboarding/models';
import type { QuoteItemDraft } from '../BudgetWizard.types';

export type CreateQuotePayload = {
  customerId: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'BOTH';
  items: QuoteItemDraft[];
};

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const createQuote = async (payload: CreateQuotePayload): Promise<QuoteResponse> => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as QuoteResponse;
};

export const sendQuote = async (id: string, channel: 'EMAIL' | 'WHATSAPP' | 'BOTH'): Promise<QuoteResponse> => {
  const response = await fetch(`/api/quotes/${id}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel }),
  });
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as QuoteResponse;
};


