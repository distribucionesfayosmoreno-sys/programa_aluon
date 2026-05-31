import type { QuoteResponse } from '../../customer-onboarding/models';
import type { QuoteLifecycleNumbersResponse } from '../components/DocumentDrawer.types';

const parseJsonOrThrow = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return (await response.json()) as T;
};

export const fetchQuoteById = async (quoteId: string, signal?: AbortSignal): Promise<QuoteResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}`, { signal });
  return parseJsonOrThrow<QuoteResponse>(response);
};

export const fetchLifecycleNumbers = async (
  quoteId: string,
  signal?: AbortSignal,
): Promise<QuoteLifecycleNumbersResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/lifecycle-numbers`, { signal });
  return parseJsonOrThrow<QuoteLifecycleNumbersResponse>(response);
};

