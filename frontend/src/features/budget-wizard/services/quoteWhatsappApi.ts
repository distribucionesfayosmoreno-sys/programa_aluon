type QuoteWhatsappLinkResponse = {
  url: string;
  message: string;
  documentUrl: string;
};

export const getQuoteWhatsappLink = async (quoteId: string): Promise<QuoteWhatsappLinkResponse> => {
  const response = await fetch(`/api/quotes/${encodeURIComponent(quoteId)}/send/whatsapp-link`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo preparar WhatsApp.');
  }
  return (await response.json()) as QuoteWhatsappLinkResponse;
};
