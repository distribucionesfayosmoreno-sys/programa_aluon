const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const ensureQuotePdfGenerated = async (quoteId: string): Promise<void> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/pdf`, { method: 'POST' });
  if (!response.ok) throw new Error(await readTextError(response));
};

export const quotePdfUrl = (quoteId: string): string => `/api/quotes/${encodeURIComponent(quoteId)}/pdf`;

