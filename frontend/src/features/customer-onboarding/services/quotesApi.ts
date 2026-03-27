import type { QuoteChannel, QuoteItemDraft, QuoteResponse } from '../models';

type CreateQuotePayload = {
  customerId: string;
  channel: QuoteChannel;
  items: QuoteItemDraft[];
};

export const createQuote = async (payload: CreateQuotePayload) => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al generar el presupuesto');
  }
  return (await response.json()) as QuoteResponse;
};
