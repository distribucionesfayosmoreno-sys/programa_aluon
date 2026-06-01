import { useCallback, useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../../customer-onboarding/models';
import type { DocumentDrawerMetaValues } from './DocumentDrawerMetaGrid.types';
import { patchQuoteById } from '../services/quoteDetailsApi';

const toMetaValues = (quote: QuoteResponse): DocumentDrawerMetaValues => ({
  nombreComercial: quote.customerNombreComercial ?? quote.customerName ?? '',
  contactEmail: quote.contactEmail ?? '',
  telefono: quote.customerTelefono ?? quote.contactWhatsapp ?? '',
  direccionEntrega: [
    quote.deliveryDireccionEntrega,
    quote.deliveryCp,
    quote.deliveryPoblacion,
    quote.deliveryProvincia,
  ].filter((v): v is string => typeof v === 'string' && v.length > 0).join(', '),
  direccion: quote.customerDireccion ?? '',
  cp: quote.customerCp ?? '',
  poblacion: quote.customerPoblacion ?? '',
  provincia: quote.customerProvincia ?? '',
});

export const useDocumentDrawerEdit = (quote: QuoteResponse | null) => {
  const initial = useMemo(() => (quote ? toMetaValues(quote) : null), [quote]);
  const [draft, setDraft] = useState<DocumentDrawerMetaValues | null>(initial);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    setDraft(initial);
    setSaveError('');
    setSaving(false);
  }, [initial]);

  const patch = useCallback((p: Partial<DocumentDrawerMetaValues>) => {
    setDraft((prev) => (prev ? { ...prev, ...p } : prev));
  }, []);

  const reset = useCallback(() => {
    setDraft(initial);
    setSaveError('');
  }, [initial]);

  const save = useCallback(async () => {
    if (!quote || !draft) return null;
    setSaving(true);
    setSaveError('');
    try {
      const updated = await patchQuoteById(quote.id, {
        customerNombreComercial: draft.nombreComercial,
        customerTelefono: draft.telefono,
        customerDireccion: draft.direccion,
        customerCp: draft.cp,
        customerPoblacion: draft.poblacion,
        customerProvincia: draft.provincia,
        deliveryDireccionEntrega: draft.direccionEntrega,
        contactEmail: draft.contactEmail,
        contactWhatsapp: draft.telefono,
      });
      return updated;
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [draft, quote]);

  return {
    draft,
    patch,
    reset,
    save,
    saving,
    saveError,
  } as const;
};

