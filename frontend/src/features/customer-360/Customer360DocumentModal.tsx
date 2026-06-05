import { useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../customer-onboarding/models';
import { dashboardTheme } from '../dashboard/dashboardTheme';
import type { Customer360DocumentItem } from './customer360Types';
import { fetchLifecycleNumbers, fetchQuoteById, listQuoteDocuments, quotePreviewPdfUrl } from '../project-management/services/quoteDetailsApi';
import type { QuoteDocumentRowResponse, QuoteLifecycleNumbersResponse } from '../project-management/components/DocumentDrawer.types';
import { DocumentPopupFrame } from '../documents/components/DocumentPopupFrame';
import {
  DocumentInfoLine,
  DocumentSectionCard,
  DocumentStatCard,
  documentSurfaceGradient,
} from '../documents/components/documentPopupPrimitives';

type Props = {
  open: boolean;
  document: Customer360DocumentItem | null;
  onClose: () => void;
  onOpenDocument?: (document: Customer360DocumentItem) => void;
};

const documentTypeLabel: Record<Customer360DocumentItem['type'], string> = {
  PRESUPUESTO: 'Presupuesto',
  PEDIDO: 'Pedido',
  ALBARAN: 'Albarán',
  FACTURA: 'Factura',
  ABONO: 'Abono',
};

const typeTone: Record<Customer360DocumentItem['type'], { bg: string; color: string }> = {
  PRESUPUESTO: { bg: '#eff6ff', color: '#1d4ed8' },
  PEDIDO: { bg: '#fef3c7', color: '#b45309' },
  ALBARAN: { bg: '#ecfeff', color: '#0e7490' },
  FACTURA: { bg: '#f3e8ff', color: '#7c3aed' },
  ABONO: { bg: '#ecfdf5', color: '#047857' },
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const formatCurrency = (value: number): string =>
  value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

const statusTone = (type: Customer360DocumentItem['type'], status: string): { bg: string; color: string; label: string } => {
  const normalized = status.toUpperCase();

  if (type === 'FACTURA') {
    if (normalized === 'PAGADA') return { bg: '#dcfce7', color: '#15803d', label: 'Pagada' };
    if (normalized === 'ANULADA') return { bg: '#fee2e2', color: '#b91c1c', label: 'Anulada' };
    return { bg: '#fef3c7', color: '#b45309', label: normalized || 'Pendiente' };
  }

  if (type === 'ALBARAN') {
    if (normalized === 'FACTURADO') return { bg: '#dcfce7', color: '#15803d', label: 'Facturado' };
    return { bg: '#fef3c7', color: '#b45309', label: normalized || 'Pendiente' };
  }

  if (type === 'PEDIDO') {
    if (normalized === 'FINALIZADO') return { bg: '#dcfce7', color: '#15803d', label: 'Finalizado' };
    return { bg: '#dbeafe', color: '#1d4ed8', label: normalized || 'Abierto' };
  }

  if (type === 'ABONO') {
    return { bg: '#ecfdf5', color: '#047857', label: normalized || 'Emitido' };
  }

  return { bg: '#dbeafe', color: '#1d4ed8', label: normalized || 'Pendiente' };
};

const rowsForQuote = (quoteDocuments: QuoteDocumentRowResponse[], selectedType: Customer360DocumentItem['type']): QuoteDocumentRowResponse[] => {
  const selected = selectedType.toUpperCase();
  return quoteDocuments.filter(doc => doc.tipo.toUpperCase() === selected);
};

export const Customer360DocumentModal = ({ open, document, onClose, onOpenDocument }: Props) => {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteDocuments, setQuoteDocuments] = useState<QuoteDocumentRowResponse[]>([]);
  const [lifecycle, setLifecycle] = useState<QuoteLifecycleNumbersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [openingPdf, setOpeningPdf] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const quoteId = document?.quoteId ?? null;
    if (!open || !quoteId) {
      setQuote(null);
      setQuoteDocuments([]);
      setLifecycle(null);
      setLoading(false);
      setError('');
      setOpeningPdf(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');

    void (async () => {
      try {
        const [nextQuote, nextDocuments, nextLifecycle] = await Promise.all([
          fetchQuoteById(quoteId, controller.signal),
          listQuoteDocuments(quoteId, controller.signal),
          fetchLifecycleNumbers(quoteId, controller.signal),
        ]);

        if (controller.signal.aborted) return;
        setQuote(nextQuote);
        setQuoteDocuments(nextDocuments);
        setLifecycle(nextLifecycle);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle del documento.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [document, open]);

  const selectedQuoteDocuments = useMemo(() => (
    document ? rowsForQuote(quoteDocuments, document.type) : []
  ), [document, quoteDocuments]);

  const handleOpenPdf = async () => {
    if (!document?.quoteId) return;
    setOpeningPdf(true);
    try {
      window.open(quotePreviewPdfUrl(document.quoteId, document.type, document.number), '_blank', 'noopener,noreferrer');
    } finally {
      setOpeningPdf(false);
    }
  };

  if (!document) return null;

  const tone = typeTone[document.type];
  const status = statusTone(document.type, document.statusLabel);
  const handleAssociatedDocumentOpen = (doc: QuoteDocumentRowResponse) => {
    const nextDocument: Customer360DocumentItem = {
      id: doc.id,
      type: doc.tipo as Customer360DocumentItem['type'],
      number: doc.numeroDocumento,
      statusLabel: 'EMITIDO',
      createdAt: doc.createdAt,
      quoteId: document.quoteId,
      customerName: document.customerName,
      source: document.source,
    };
    if (onOpenDocument) {
      onOpenDocument(nextDocument);
      return;
    }
    alert('No hay navegación de documentos conectada para esta vista.');
  };

  return (
    <DocumentPopupFrame
      open={open}
      title={`${documentTypeLabel[document.type]} #${document.number}`}
      subtitle={document.customerName}
      onClose={onClose}
      headerVariant="none"
    >
      <div className="rounded-[22px] border p-6" style={{ ...documentSurfaceGradient, borderColor: dashboardTheme.border }}>
        <div className="space-y-5">
          <section className="rounded-[18px] border bg-white shadow-[0_18px_40px_rgba(16,24,40,0.08)]">
            <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: dashboardTheme.accentBars.transactions }} aria-hidden="true" />
                  <h3 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
                    Detalle del documento
                  </h3>
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: dashboardTheme.muted }}>
                  Información operativa vinculada al documento seleccionado
                </p>
              </div>
              <div
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                style={{ background: tone.bg, color: tone.color }}
              >
                {documentTypeLabel[document.type]}
              </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <DocumentStatCard label="Número" value={document.number} />
              <DocumentStatCard label="Estado" value={status.label} />
              <DocumentStatCard label="Origen" value={document.source === 'backend' ? 'Backend' : 'Local'} />
              <DocumentStatCard label="Fecha" value={formatDate(document.createdAt)} />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <DocumentSectionCard title="Resumen" tone="income" className="h-full">
              <div className="space-y-3">
                <DocumentInfoLine label="Cliente" value={document.customerName} />
                <DocumentInfoLine label="Identificador de presupuesto" value={document.quoteId} />
                <DocumentInfoLine label="Tipo" value={documentTypeLabel[document.type]} />
                <DocumentInfoLine label="Estado" value={status.label} />
                <DocumentInfoLine label="Origen" value={document.source === 'backend' ? 'Backend' : 'Local'} />
              </div>
            </DocumentSectionCard>

            <DocumentSectionCard title="Acciones" tone="expenses" className="h-full">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  disabled={!document.quoteId || openingPdf}
                  className="w-full rounded-[14px] px-4 py-3 text-left text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: dashboardTheme.surfaceSoft, color: dashboardTheme.text, border: `1px solid ${dashboardTheme.border}` }}
                >
                  {openingPdf ? 'Abriendo PDF...' : 'Abrir PDF del documento'}
                </button>

                <div className="rounded-[16px] border bg-white px-4 py-4" style={{ borderColor: dashboardTheme.border }}>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: dashboardTheme.muted }}>
                    Documento relacionado
                  </div>
                  <div className="mt-2 text-sm font-medium" style={{ color: dashboardTheme.text }}>
                    {document.quoteId ? 'Vinculado a un presupuesto' : 'No tiene presupuesto vinculado'}
                  </div>
                </div>
              </div>
            </DocumentSectionCard>
          </div>

          {loading ? (
            <div className="rounded-[18px] border px-4 py-3 text-sm font-semibold shadow-[0_18px_40px_rgba(16,24,40,0.08)]" style={{ borderColor: dashboardTheme.border, color: '#1d4ed8', background: '#eff6ff' }}>
              Cargando detalle...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[18px] border px-4 py-3 text-sm font-semibold shadow-[0_18px_40px_rgba(16,24,40,0.08)]" style={{ borderColor: '#fecaca', color: '#b91c1c', background: '#fef2f2' }}>
              {error}
            </div>
          ) : null}

          {quote ? (
            <DocumentSectionCard
              title="Presupuesto vinculado"
              subtitle="Datos y líneas relacionadas"
              tone="transactions"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <DocumentInfoLine label="Cliente" value={quote.customerNombreComercial || quote.customerName} />
                  <DocumentInfoLine label="Tarifa" value={quote.tariffCode} />
                  <DocumentInfoLine label="Contacto" value={quote.contactEmail || quote.contactWhatsapp} />
                  <DocumentInfoLine label="Total" value={formatCurrency(quote.total)} />
                  <DocumentInfoLine label="Entrega" value={[quote.deliveryDireccionEntrega, quote.deliveryPoblacion].filter(Boolean).join(' · ') || null} />
                  <DocumentInfoLine label="Validado" value={quote.validatedAt ? formatDate(quote.validatedAt) : 'Pendiente'} />
                </div>

                <div className="rounded-[16px] border bg-white overflow-hidden" style={{ borderColor: dashboardTheme.border }}>
                  <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                    <thead style={{ background: dashboardTheme.surfaceSoft }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                          Línea
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, index) => (
                        <tr key={`${item.doorModel}:${item.doorType}:${index}`} style={{ borderTop: `1px solid ${dashboardTheme.border}` }}>
                          <td className="px-4 py-3">
                            <div className="font-semibold" style={{ color: dashboardTheme.text }}>
                              {item.doorModel}
                            </div>
                            <div className="text-[11px]" style={{ color: dashboardTheme.muted }}>
                              {item.widthMm} × {item.heightMm} mm
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium" style={{ color: dashboardTheme.text }}>
                            {item.doorType}
                          </td>
                          <td className="px-4 py-3 text-right font-black" style={{ color: dashboardTheme.text }}>
                            {formatCurrency(item.lineTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DocumentSectionCard>
          ) : null}

          {selectedQuoteDocuments.length > 0 ? (
            <DocumentSectionCard title="Documentos del presupuesto" tone="histogram">
              <div className="space-y-3">
                {selectedQuoteDocuments.map(doc => (
                  <div
                    key={`${doc.tipo}:${doc.id}:${doc.numeroDocumento}:${doc.createdAt}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir documento asociado ${doc.tipo} ${doc.numeroDocumento}`}
                    onClick={() => handleAssociatedDocumentOpen(doc)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleAssociatedDocumentOpen(doc);
                      }
                    }}
                    className="cursor-pointer rounded-[16px] border bg-white px-4 py-3 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                    style={{ borderColor: dashboardTheme.border }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                          {doc.tipo}
                        </div>
                        <div className="mt-1 text-sm font-semibold" style={{ color: dashboardTheme.text }}>
                          {doc.numeroDocumento}
                        </div>
                      </div>
                      <div className="text-right text-[11px] font-medium" style={{ color: dashboardTheme.muted }}>
                        {formatDate(doc.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DocumentSectionCard>
          ) : null}

          {lifecycle ? (
            <DocumentSectionCard title="Secuencia de documentos" tone="issues">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                <DocumentStatCard label="Presupuesto" value={lifecycle.presupuesto} />
                <DocumentStatCard label="Pedido" value={lifecycle.pedido} />
                <DocumentStatCard label="Albarán" value={lifecycle.albaran} />
                <DocumentStatCard label="Factura" value={lifecycle.factura} />
                <DocumentStatCard label="Abono" value={lifecycle.abono} />
              </div>
            </DocumentSectionCard>
          ) : null}
        </div>
      </div>
    </DocumentPopupFrame>
  );
};
