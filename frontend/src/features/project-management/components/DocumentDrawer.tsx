import { useMemo, useState } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import type { DocumentDrawerRow } from './DocumentDrawer.types';
import { DocumentDrawerShell } from './DocumentDrawerShell';
import { useDocumentDrawer } from './useDocumentDrawer';
import { emitQuoteDocument, quoteDocumentPdfUrl } from '../services/quoteDetailsApi';

type Props = {
  open: boolean;
  row: ProjectDocumentRow | null;
  onClose: () => void;
  onOpenPdf: (row: ProjectDocumentRow) => void;
  onEdit: (projectId: string) => void;
};

const fmtEur = (value: number): string => {
  const fixed = Number.isFinite(value) ? value : 0;
  return fixed.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const toDrawerRow = (row: ProjectDocumentRow | null): DocumentDrawerRow | null => {
  if (!row?.quoteId) return null;
  return {
    projectId: row.projectId,
    quoteId: row.quoteId,
    kind: row.type,
    number: row.number,
    customerName: row.customerName,
    createdAt: row.createdAt,
  };
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="px-5 py-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
    <div className="flex items-center justify-between">
      <div className="text-xs font-black uppercase tracking-wide" style={{ color: '#475569' }}>
        {title}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

export const DocumentDrawer = ({ open, row, onClose, onOpenPdf, onEdit }: Props) => {
  const drawerRow = useMemo(() => toDrawerRow(row), [row]);
  const { loading, error, data } = useDocumentDrawer(drawerRow);
  const [isConverting, setIsConverting] = useState(false);

  const subtitle = row ? `${row.customerName} · ${row.createdAt}` : '';
  const title = data ? `${data.docTypeLabel} #${data.docNumber}` : (row ? `${row.type} #${row.number}` : 'Documento');

  const existingByTipo = useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    for (const doc of data.existingDocuments) {
      if (!doc?.tipo || !doc?.numeroDocumento) continue;
      map.set(String(doc.tipo).toUpperCase(), doc.numeroDocumento);
    }
    return map;
  }, [data]);

  const openStoredPdf = (tipo: string) => {
    if (!row?.quoteId) return;
    window.open(quoteDocumentPdfUrl(row.quoteId, tipo), '_blank', 'noopener,noreferrer');
  };

  const convertTo = async (tipo: string) => {
    if (!row?.quoteId) return;
    if (isConverting) return;
    setIsConverting(true);
    try {
      await emitQuoteDocument(row.quoteId, tipo);
      openStoredPdf(tipo);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo generar el documento.');
    } finally {
      setIsConverting(false);
    }
  };

  const traceTypes = useMemo(() => ([
    { tipo: 'PRESUPUESTO', label: 'Presupuesto', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-500 hover:bg-blue-100' },
    { tipo: 'PEDIDO', label: 'Pedido', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-500 hover:bg-orange-100' },
    { tipo: 'ALBARAN', label: 'Albarán', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-500 hover:bg-purple-100' },
    { tipo: 'FACTURA', label: 'Factura', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100' },
    { tipo: 'ABONO', label: 'Abono', color: 'bg-red-50 text-red-700 border-red-200 hover:border-red-500 hover:bg-red-100' },
  ] as const), []);

  return (
    <DocumentDrawerShell open={open} title={title} subtitle={subtitle} onClose={onClose}>
      {loading ? (
        <div className="px-5 py-6 text-sm font-semibold" style={{ color: '#64748b' }}>
          Cargando…
        </div>
      ) : null}

      {error ? (
        <div className="px-5 py-4">
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
            {error}
          </div>
        </div>
      ) : null}

      {data && row ? (
        <>
          <Section title="Trazabilidad">
            <div className="flex flex-wrap gap-2">
              {traceTypes.map(t => {
                const emittedNumber = existingByTipo.get(t.tipo);
                const lifecycleNumber =
                  t.tipo === 'PRESUPUESTO' ? data.lifecycle.presupuesto
                    : t.tipo === 'PEDIDO' ? data.lifecycle.pedido
                      : t.tipo === 'ALBARAN' ? data.lifecycle.albaran
                        : t.tipo === 'FACTURA' ? data.lifecycle.factura
                          : data.lifecycle.abono;
                const code = emittedNumber ?? lifecycleNumber;
                const emitted = Boolean(emittedNumber);
                return (
                  <button
                    key={t.tipo}
                    type="button"
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${t.color}`}
                    title={emitted ? `Abrir ${t.label}: ${code}` : `${t.label} no emitido`}
                    onClick={() => (emitted ? openStoredPdf(t.tipo) : undefined)}
                    disabled={!emitted}
                    style={{ opacity: emitted ? 1 : 0.5, cursor: emitted ? 'pointer' : 'not-allowed' }}
                  >
                    <span className="uppercase tracking-wide">{t.label}</span>
                    <span className="font-bold">{code}</span>
                    {emitted ? <span className="text-[10px] opacity-40">⌊</span> : <span className="text-[9px] opacity-70">NO</span>}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Resumen">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: '#e5e7eb', background: '#ffffff' }}>
                <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#94a3b8' }}>Subtotal</div>
                <div className="text-sm font-black mt-1" style={{ color: '#0f172a' }}>{fmtEur(data.totals.subtotal)}</div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: '#e5e7eb', background: '#ffffff' }}>
                <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#94a3b8' }}>IVA</div>
                <div className="text-sm font-black mt-1" style={{ color: '#0f172a' }}>{fmtEur(data.totals.vatAmount)}</div>
              </div>
              <div className="rounded-xl border p-3 col-span-2" style={{ borderColor: '#e5e7eb', background: '#f8fafc' }}>
                <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#94a3b8' }}>Total</div>
                <div className="text-base font-black mt-1" style={{ color: '#0f172a' }}>{fmtEur(data.totals.total)}</div>
              </div>
            </div>
          </Section>

          <Section title="Cliente">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: 'var(--accent)' }}>
                {String(row.customerName || 'C').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black truncate" style={{ color: '#0f172a' }}>{row.customerName || '—'}</div>
                <div className="text-xs font-semibold mt-1" style={{ color: '#64748b' }}>
                  {data.quote.contactEmail || '—'} · {data.quote.contactWhatsapp || '—'}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Líneas">
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Descripción
                      </th>
                      <th className="px-3 py-2 text-right" style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr key={`${item.doorModel}:${idx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-3 py-2.5">
                          <div className="text-xs font-black" style={{ color: '#0f172a' }}>
                            {item.doorModel} · {item.doorType}
                          </div>
                          <div className="text-xs font-semibold mt-1" style={{ color: '#64748b' }}>
                            {item.widthMm}×{item.heightMm} mm · m²: {item.m2.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right text-xs font-black" style={{ color: '#0f172a' }}>
                          {fmtEur(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          <Section title="Acciones">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
                onClick={() => onOpenPdf(row)}
              >
                Abrir PDF
              </button>

              {row.type === 'PRESUPUESTO' && !existingByTipo.get('PEDIDO') ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ background: '#ffffff', border: '1px solid #e5e7eb', color: '#0f172a' }}
                  disabled={isConverting}
                  onClick={() => void convertTo('PEDIDO')}
                >
                  {isConverting ? 'Generando…' : 'Convertir a Pedido'}
                </button>
              ) : null}

              {row.type === 'PEDIDO' && !existingByTipo.get('ALBARAN') ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ background: '#ffffff', border: '1px solid #e5e7eb', color: '#0f172a' }}
                  disabled={isConverting}
                  onClick={() => void convertTo('ALBARAN')}
                >
                  {isConverting ? 'Generando…' : 'Convertir a Albarán'}
                </button>
              ) : null}

              {row.type === 'ALBARAN' && !existingByTipo.get('FACTURA') ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ background: '#ffffff', border: '1px solid #e5e7eb', color: '#0f172a' }}
                  disabled={isConverting}
                  onClick={() => void convertTo('FACTURA')}
                >
                  {isConverting ? 'Generando…' : 'Convertir a Factura'}
                </button>
              ) : null}

              {row.type === 'FACTURA' && !existingByTipo.get('ABONO') ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ background: '#ffffff', border: '1px solid #e5e7eb', color: '#0f172a' }}
                  disabled={isConverting}
                  onClick={() => void convertTo('ABONO')}
                >
                  {isConverting ? 'Generando…' : 'Crear Abono'}
                </button>
              ) : null}

              {row.type === 'PRESUPUESTO' ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ background: '#ffffff', border: '1px solid #e5e7eb', color: '#0f172a' }}
                  onClick={() => onEdit(row.projectId)}
                >
                  Editar
                </button>
              ) : null}
            </div>
          </Section>
        </>
      ) : null}
    </DocumentDrawerShell>
  );
};
