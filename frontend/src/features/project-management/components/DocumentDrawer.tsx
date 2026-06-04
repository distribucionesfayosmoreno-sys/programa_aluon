import { useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../../customer-onboarding/models';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import type { DocumentDrawerRow } from './DocumentDrawer.types';
import { DocumentDrawerShell } from './DocumentDrawerShell';
import { DocumentDrawerHeader } from './DocumentDrawerHeader';
import type { DocumentDrawerSubview } from './DocumentDrawerView.types';
import { DocumentDrawerLinesView } from './DocumentDrawerLinesView';
import { DocumentDrawerFooter } from './DocumentDrawerFooter';
import { DocumentDrawerMetaGrid } from './DocumentDrawerMetaGrid';
import { DocumentDrawerTotalsPanel } from './DocumentDrawerTotalsPanel';
import { useDocumentDrawer } from './useDocumentDrawer';
import { useDocumentDrawerEdit } from './useDocumentDrawerEdit';
import { emitQuoteDocument, quoteDocumentPdfUrl } from '../services/quoteDetailsApi';
import { documentManagementTheme } from '../documentManagementTheme';

type Props = {
  open: boolean;
  row: ProjectDocumentRow | null;
  onClose: () => void;
  onOpenPdf: (row: ProjectDocumentRow) => void;
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
  <div
    className="px-5 py-4"
    style={{ borderBottom: `1px solid ${documentManagementTheme.border}` }}
  >
    <div className="flex items-center justify-between">
      <div className="text-xs font-black uppercase tracking-wide" style={{ color: documentManagementTheme.muted }}>
        {title}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

export const DocumentDrawer = ({ open, row, onClose, onOpenPdf }: Props) => {
  const drawerRow = useMemo(() => toDrawerRow(row), [row]);
  const { loading, error, data } = useDocumentDrawer(drawerRow);
  const [quoteOverride, setQuoteOverride] = useState<QuoteResponse | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [activeTipo, setActiveTipo] = useState<string | null>(null);
  const [optimisticByTipo, setOptimisticByTipo] = useState<Record<string, string>>({});
  const [subview, setSubview] = useState<DocumentDrawerSubview>('document');
  const [isEditing, setIsEditing] = useState(false);

  const effectiveTipo = (activeTipo ?? row?.type ?? '').toString().toUpperCase();
  const quoteForDisplay = data ? (quoteOverride ?? data.quote) : null;
  const edit = useDocumentDrawerEdit(quoteForDisplay);

  const existingByTipo = useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    for (const doc of data.existingDocuments) {
      if (!doc?.tipo || !doc?.numeroDocumento) continue;
      map.set(String(doc.tipo).toUpperCase(), doc.numeroDocumento);
    }
    for (const [tipo, numeroDocumento] of Object.entries(optimisticByTipo)) {
      if (!tipo || !numeroDocumento) continue;
      map.set(tipo.toUpperCase(), numeroDocumento);
    }
    return map;
  }, [data, optimisticByTipo]);

  const lifecycleByTipo = useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    map.set('PRESUPUESTO', data.lifecycle.presupuesto);
    map.set('PEDIDO', data.lifecycle.pedido);
    map.set('ALBARAN', data.lifecycle.albaran);
    map.set('FACTURA', data.lifecycle.factura);
    map.set('ABONO', data.lifecycle.abono);
    return map;
  }, [data]);

  const title = useMemo(() => {
    if (!data || !row) return row ? `${row.type} #${row.number}` : 'Documento';
    const label =
      effectiveTipo === 'PRESUPUESTO' ? 'Presupuesto'
        : effectiveTipo === 'PEDIDO' ? 'Pedido'
          : effectiveTipo === 'ALBARAN' ? 'Albarán'
            : effectiveTipo === 'FACTURA' ? 'Factura'
              : effectiveTipo === 'ABONO' ? 'Abono'
                : effectiveTipo;
    const number = existingByTipo.get(effectiveTipo) ?? lifecycleByTipo.get(effectiveTipo) ?? row.number;
    return `${label} #${number}`;
  }, [data, row, effectiveTipo, existingByTipo, lifecycleByTipo]);

  const openStoredPdf = (tipo: string) => {
    if (!row?.quoteId) return;
    window.open(quoteDocumentPdfUrl(row.quoteId, tipo), '_blank', 'noopener,noreferrer');
  };

  const canEmit = (tipo: string): boolean => {
    const t = tipo.toUpperCase();
    if (t === 'PRESUPUESTO') return false;
    if (t === 'PEDIDO') return true;
    if (t === 'ALBARAN') return existingByTipo.has('PEDIDO');
    if (t === 'FACTURA') return existingByTipo.has('ALBARAN');
    if (t === 'ABONO') return existingByTipo.has('FACTURA');
    return false;
  };

  const emitOpen = async (tipo: string): Promise<void> => {
    const upper = tipo.toUpperCase();
    if (!row?.quoteId) return;
    if (!canEmit(upper)) return;
    if (!existingByTipo.has(upper)) {
      await emitAndActivate(upper);
    }
    openStoredPdf(upper);
  };

  const primaryEmitTarget = useMemo(() => {
    if (effectiveTipo === 'PEDIDO') return 'ALBARAN' as const;
    if (effectiveTipo === 'ALBARAN') return 'FACTURA' as const;
    return null;
  }, [effectiveTipo]);

  const emitAndActivate = async (tipo: string) => {
    if (!row?.quoteId) return;
    if (isConverting) return;
    setIsConverting(true);
    try {
      const created = await emitQuoteDocument(row.quoteId, tipo);
      setOptimisticByTipo(prev => ({
        ...prev,
        [String(created.tipo).toUpperCase()]: created.numeroDocumento,
      }));
      setActiveTipo(String(created.tipo).toUpperCase());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo generar el documento.');
    } finally {
      setIsConverting(false);
    }
  };

  // Reset navigation when opening a new document/quote.
  useEffect(() => {
    if (!row) return;
    setActiveTipo(row.type);
    setOptimisticByTipo({});
    setSubview('document');
    setIsEditing(false);
    setQuoteOverride(null);
  }, [row]);

  const handleView = async () => {
    if (!row?.quoteId) return;
    const tipo = effectiveTipo || row.type;
    const upperTipo = tipo.toUpperCase();

    if (upperTipo === 'PRESUPUESTO') {
      onOpenPdf({ ...row, type: 'PRESUPUESTO' });
      return;
    }

    if (!existingByTipo.has(upperTipo)) {
      if (!canEmit(upperTipo)) return;
      await emitAndActivate(upperTipo);
    }
    openStoredPdf(upperTipo);
  };

  return (
    <DocumentDrawerShell open={open} onClose={onClose}>
      <DocumentDrawerHeader
        title={title}
        subtitle={row?.customerName ?? undefined}
        badge={effectiveTipo || row?.type || ''}
        subview={subview}
        onChangeSubview={setSubview}
        onClose={onClose}
      />

      <div
        className="flex-1 min-h-0 overflow-y-auto p-2"
        style={{ background: documentManagementTheme.panelSoftBg }}
      >
        {loading ? (
          <div className="px-3 py-4 text-sm font-semibold" style={{ color: documentManagementTheme.muted }}>
            Cargando…
          </div>
        ) : null}

        {error ? (
          <div className="px-3 py-3">
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: '#fecaca', background: '#fff1f2', color: '#9f1239' }}
            >
              {error}
            </div>
          </div>
        ) : null}

        {data && row && drawerRow ? (
          subview === 'lines' ? null : (
            <>
              <DocumentDrawerMetaGrid
                mode={isEditing ? 'edit' : 'read'}
                values={edit.draft ?? {
                  nombreComercial: '',
                  contactEmail: '',
                  telefono: '',
                  direccionEntrega: '',
                  direccion: '',
                  cp: '',
                  poblacion: '',
                  provincia: '',
                }}
                onChange={isEditing ? edit.patch : undefined}
              />
              <Section title="Líneas">
                <DocumentDrawerLinesView
                  items={data.items}
                  totals={data.totals}
                  formatEur={fmtEur}
                  variant="embedded"
                />
              </Section>
            </>
          )
        ) : null}
      </div>

      {data && row ? (
        <div className="flex items-end justify-end px-3 pb-2">
          <DocumentDrawerTotalsPanel totals={data.totals} formatEur={fmtEur} />
        </div>
      ) : null}

      {data && row ? (
        <DocumentDrawerFooter
          isConverting={isConverting}
          isEditing={isEditing}
          isSaving={edit.saving}
          saveError={edit.saveError}
          primaryEmitTarget={primaryEmitTarget}
          canEmit={(t) => canEmit(t)}
          onEmitOpen={(t) => void emitOpen(t)}
          onCancel={onClose}
          onEdit={() => setIsEditing(true)}
          onCancelEdit={() => {
            edit.reset();
            setIsEditing(false);
          }}
          onSave={() => {
            void (async () => {
              const updated = await edit.save();
              if (updated) {
                setQuoteOverride(updated);
                setIsEditing(false);
              }
            })();
          }}
          onPreview={() => void handleView()}
          relatedCodesByTipo={new Map(
            (['PEDIDO', 'ALBARAN', 'FACTURA'] as const)
              .map((t) => [t, existingByTipo.get(t) ?? ''] as const)
              .filter(([, code]) => Boolean(code))
          )}
          onNavigateRelated={(t) => {
            setActiveTipo(t);
            setSubview('document');
          }}
        />
      ) : null}
    </DocumentDrawerShell>
  );
};
