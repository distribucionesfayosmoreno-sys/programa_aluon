import { useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../../customer-onboarding/models';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import { DocumentDrawerShell } from './DocumentDrawerShell';
import { DocumentDrawerHeader } from './DocumentDrawerHeader';
import type { DocumentDrawerSubview } from './DocumentDrawerView.types';
import { DocumentDrawerLinesView } from './DocumentDrawerLinesView';
import { DocumentDrawerFooter } from './DocumentDrawerFooter';
import { DocumentDrawerMetaGrid } from './DocumentDrawerMetaGrid';
import { DocumentDrawerTotalsPanel } from './DocumentDrawerTotalsPanel';
import { ManualDocumentDrawerFooter } from './ManualDocumentDrawerFooter';
import { ManualDocumentDrawerPanel } from './ManualDocumentDrawerPanel';
import { useDocumentDrawer } from './useDocumentDrawer';
import { useDocumentDrawerEdit } from './useDocumentDrawerEdit';
import { useManualDocumentDrawerEdit } from './useManualDocumentDrawerEdit';
import { emitQuoteDocument, quoteDocumentPdfUrl } from '../services/quoteDetailsApi';
import { documentManagementTheme } from '../documentManagementTheme';
import type { ProjectDocumentKind } from '../ProjectManagement.types';

type Props = {
  open: boolean;
  row: ProjectDocumentRow | null;
  onClose: () => void;
  onOpenPdf: (row: ProjectDocumentRow) => void;
  onRowUpdated?: (row: ProjectDocumentRow) => void;
};

const fmtEur = (value: number): string => {
  const fixed = Number.isFinite(value) ? value : 0;
  return fixed.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="px-5 py-4" style={{ borderBottom: `1px solid ${documentManagementTheme.border}` }}>
    <div className="flex items-center justify-between">
      <div className="text-xs font-black uppercase tracking-wide" style={{ color: documentManagementTheme.muted }}>
        {title}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

const toQuoteRowUpdate = (row: ProjectDocumentRow, quote: QuoteResponse): ProjectDocumentRow => ({
  ...row,
  customerName: quote.customerNombreComercial?.trim() || quote.customerName || row.customerName,
});

const toManualType = (value: string): Exclude<ProjectDocumentKind, 'PRESUPUESTO'> =>
  (value as Exclude<ProjectDocumentKind, 'PRESUPUESTO'>);

export const DocumentDrawer = ({ open, row, onClose, onOpenPdf, onRowUpdated }: Props) => {
  const { loading, error, data } = useDocumentDrawer(row);
  const [quoteOverride, setQuoteOverride] = useState<QuoteResponse | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [activeTipo, setActiveTipo] = useState<string | null>(null);
  const [optimisticByTipo, setOptimisticByTipo] = useState<Record<string, string>>({});
  const [subview, setSubview] = useState<DocumentDrawerSubview>('document');
  const [isEditing, setIsEditing] = useState(false);

  const quoteData = data?.kind === 'quote' ? data : null;
  const manualData = data?.kind === 'manual' ? data.document : null;
  const quoteForDisplay = quoteData ? (quoteOverride ?? quoteData.quote) : null;
  const quoteEdit = useDocumentDrawerEdit(quoteForDisplay);
  const manualEdit = useManualDocumentDrawerEdit(manualData ? row : null);

  const effectiveTipo = (activeTipo ?? row?.type ?? '').toString().toUpperCase();

  const existingByTipo = useMemo(() => {
    const map = new Map<string, string>();
    if (!quoteData) return map;
    for (const doc of quoteData.existingDocuments) {
      if (!doc?.tipo || !doc?.numeroDocumento) continue;
      map.set(String(doc.tipo).toUpperCase(), doc.numeroDocumento);
    }
    for (const [tipo, numeroDocumento] of Object.entries(optimisticByTipo)) {
      if (!tipo || !numeroDocumento) continue;
      map.set(tipo.toUpperCase(), numeroDocumento);
    }
    return map;
  }, [quoteData, optimisticByTipo]);

  const lifecycleByTipo = useMemo(() => {
    const map = new Map<string, string>();
    if (!quoteData) return map;
    map.set('PRESUPUESTO', quoteData.lifecycle.presupuesto);
    map.set('PEDIDO', quoteData.lifecycle.pedido);
    map.set('ALBARAN', quoteData.lifecycle.albaran);
    map.set('FACTURA', quoteData.lifecycle.factura);
    map.set('ABONO', quoteData.lifecycle.abono);
    return map;
  }, [quoteData]);

  const title = useMemo(() => {
    if (!row) return 'Documento';
    if (manualData) {
      return `${row.type} #${row.number}`;
    }
    if (!quoteData) return `${row.type} #${row.number}`;

    const label =
      effectiveTipo === 'PRESUPUESTO' ? 'Presupuesto'
        : effectiveTipo === 'PEDIDO' ? 'Pedido'
          : effectiveTipo === 'ALBARAN' ? 'Albarán'
            : effectiveTipo === 'FACTURA' ? 'Factura'
              : effectiveTipo === 'ABONO' ? 'Abono'
                : effectiveTipo;
    const number = existingByTipo.get(effectiveTipo) ?? lifecycleByTipo.get(effectiveTipo) ?? row.number;
    return `${label} #${number}`;
  }, [row, manualData, quoteData, effectiveTipo, existingByTipo, lifecycleByTipo]);

  const canEmit = (tipo: string): boolean => {
    if (!quoteData) return false;
    const t = tipo.toUpperCase();
    if (t === 'PRESUPUESTO') return false;
    if (t === 'PEDIDO') return true;
    if (t === 'ALBARAN') return existingByTipo.has('PEDIDO');
    if (t === 'FACTURA') return existingByTipo.has('ALBARAN');
    if (t === 'ABONO') return existingByTipo.has('FACTURA');
    return false;
  };

  const openStoredPdf = (tipo: string) => {
    if (!row?.quoteId) return;
    window.open(quoteDocumentPdfUrl(row.quoteId, tipo), '_blank', 'noopener,noreferrer');
  };

  const emitAndActivate = async (tipo: string) => {
    if (!row?.quoteId || !quoteData || isConverting) return;
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

  const emitOpen = async (tipo: string): Promise<void> => {
    if (!quoteData || !row?.quoteId) return;
    const upper = tipo.toUpperCase();
    if (!canEmit(upper)) return;
    if (!existingByTipo.has(upper)) {
      await emitAndActivate(upper);
    }
    openStoredPdf(upper);
  };

  const primaryEmitTarget = useMemo(() => {
    if (!quoteData) return null;
    if (effectiveTipo === 'PEDIDO') return 'ALBARAN' as const;
    if (effectiveTipo === 'ALBARAN') return 'FACTURA' as const;
    return null;
  }, [quoteData, effectiveTipo]);

  const relatedCodesByTipo = useMemo(() => {
    if (!quoteData) return new Map<string, string>();
    const relatedTypes = ['PEDIDO', 'ALBARAN', 'FACTURA'] as const;
    return new Map(
      relatedTypes
        .filter(tipo => tipo !== effectiveTipo)
        .map((tipo) => [tipo, existingByTipo.get(tipo) ?? ''] as const)
        .filter(([, code]) => Boolean(code)),
    );
  }, [quoteData, effectiveTipo, existingByTipo]);

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
    if (!quoteData || !row?.quoteId) return;
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

  const handleQuoteSave = () => {
    void (async () => {
      const updated = await quoteEdit.save();
      if (updated && row) {
        const updatedRow = toQuoteRowUpdate(row, updated);
        setQuoteOverride(updated);
        setIsEditing(false);
        onRowUpdated?.(updatedRow);
      }
    })();
  };

  const handleManualSave = () => {
    void (async () => {
      const updated = await manualEdit.save();
      if (updated) {
        setIsEditing(false);
        onRowUpdated?.(updated);
      }
    })();
  };

  const manualValues = manualEdit.draft
    ? {
        customerName: manualEdit.draft.customerName,
        type: manualEdit.draft.type,
        number: manualEdit.draft.number,
        statusLabel: manualData?.statusLabel ?? row?.statusLabel ?? '',
        createdAt: manualData?.createdAt ?? row?.createdAt ?? '',
      }
    : {
        customerName: manualData?.customerName ?? row?.customerName ?? '',
        type: toManualType(manualData?.type ?? row?.type ?? 'PEDIDO'),
        number: manualData?.number ?? row?.number ?? '',
        statusLabel: manualData?.statusLabel ?? row?.statusLabel ?? '',
        createdAt: manualData?.createdAt ?? row?.createdAt ?? '',
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
        showSubviewToggle={Boolean(quoteData)}
      />

      <div className="flex-1 min-h-0 overflow-y-auto p-2" style={{ background: documentManagementTheme.panelSoftBg }}>
        {loading ? (
          <div className="px-3 py-4 text-sm font-semibold" style={{ color: documentManagementTheme.muted }}>
            Cargando…
          </div>
        ) : null}

        {error ? (
          <div className="px-3 py-3">
            <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', background: '#fff1f2', color: '#9f1239' }}>
              {error}
            </div>
          </div>
        ) : null}

        {quoteData && row ? (
          subview === 'lines' ? null : (
            <>
              <DocumentDrawerMetaGrid
                mode={isEditing ? 'edit' : 'read'}
                values={quoteEdit.draft ?? {
                  nombreComercial: '',
                  contactEmail: '',
                  telefono: '',
                  direccionEntrega: '',
                  direccion: '',
                  cp: '',
                  poblacion: '',
                  provincia: '',
                }}
                onChange={isEditing ? quoteEdit.patch : undefined}
              />
              <Section title="Líneas">
                <DocumentDrawerLinesView items={quoteData.items} totals={quoteData.totals} formatEur={fmtEur} variant="embedded" />
              </Section>
            </>
          )
        ) : null}

        {manualData && row ? (
          <div className="px-3 py-2">
            <ManualDocumentDrawerPanel
              mode={isEditing ? 'edit' : 'read'}
              values={manualValues}
              onChange={isEditing ? manualEdit.patch : undefined}
            />
          </div>
        ) : null}
      </div>

      {quoteData && row ? (
        <div className="flex items-end justify-end px-3 pb-2">
          <DocumentDrawerTotalsPanel totals={quoteData.totals} formatEur={fmtEur} />
        </div>
      ) : null}

      {quoteData && row ? (
        <DocumentDrawerFooter
          isConverting={isConverting}
          isEditing={isEditing}
          isSaving={quoteEdit.saving}
          saveError={quoteEdit.saveError}
          primaryEmitTarget={primaryEmitTarget}
          canEmit={(t) => canEmit(t)}
          onEmitOpen={(t) => void emitOpen(t)}
          onCancel={onClose}
          onEdit={() => setIsEditing(true)}
          onCancelEdit={() => {
            quoteEdit.reset();
            setIsEditing(false);
          }}
          onSave={handleQuoteSave}
          onPreview={() => void handleView()}
          relatedCodesByTipo={relatedCodesByTipo as Map<'PEDIDO' | 'ALBARAN' | 'FACTURA', string>}
          onNavigateRelated={(t) => {
            setActiveTipo(t);
            setSubview('document');
          }}
        />
      ) : null}

      {manualData && row ? (
        <ManualDocumentDrawerFooter
          isEditing={isEditing}
          isSaving={manualEdit.saving}
          saveError={manualEdit.saveError}
          onEdit={() => setIsEditing(true)}
          onCancelEdit={() => {
            manualEdit.reset();
            setIsEditing(false);
          }}
          onSave={handleManualSave}
          onCancel={onClose}
        />
      ) : null}
    </DocumentDrawerShell>
  );
};
