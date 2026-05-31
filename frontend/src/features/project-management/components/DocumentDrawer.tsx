import { useMemo } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import type { DocumentDrawerRow } from './DocumentDrawer.types';
import { DocumentDrawerShell } from './DocumentDrawerShell';
import { useDocumentDrawer } from './useDocumentDrawer';

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

  const subtitle = row ? `${row.customerName} · ${row.createdAt}` : '';
  const title = data ? `${data.docTypeLabel} #${data.docNumber}` : (row ? `${row.type} #${row.number}` : 'Documento');

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

