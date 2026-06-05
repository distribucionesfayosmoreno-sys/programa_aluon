import type { QuoteResponse } from '../../customer-onboarding/models';
import type { QuoteDocumentRowResponse, QuoteLifecycleNumbersResponse } from '../components/DocumentDrawer.types';

export type QuoteUpdateRequest = Partial<{
  customerNombreComercial: string | null;
  customerTelefono: string | null;
  customerDireccion: string | null;
  customerCp: string | null;
  customerPoblacion: string | null;
  customerProvincia: string | null;

  deliveryDireccionEntrega: string | null;
  deliveryCp: string | null;
  deliveryPoblacion: string | null;
  deliveryProvincia: string | null;

  contactEmail: string;
  contactWhatsapp: string;
}>;

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

export const listQuoteDocuments = async (quoteId: string, signal?: AbortSignal): Promise<QuoteDocumentRowResponse[]> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/documents`, { signal });
  return parseJsonOrThrow<QuoteDocumentRowResponse[]>(response);
};

export const emitQuoteDocument = async (
  quoteId: string,
  tipo: string,
  signal?: AbortSignal,
): Promise<QuoteDocumentRowResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo }),
    signal,
  });
  return parseJsonOrThrow<QuoteDocumentRowResponse>(response);
};

export const patchQuoteById = async (
  quoteId: string,
  payload: QuoteUpdateRequest,
  signal?: AbortSignal,
): Promise<QuoteResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  return parseJsonOrThrow<QuoteResponse>(response);
};

export const quotePreviewPdfUrl = (quoteId: string, tipo: string, number: string): string =>
  `/api/quotes/${encodeURIComponent(quoteId)}/pdf?type=${encodeURIComponent(tipo)}&number=${encodeURIComponent(number)}`;
