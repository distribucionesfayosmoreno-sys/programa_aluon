import { cardStyle, SectionTitle, uiColors } from '../components/ui';

export const ProductionSection = ({
  productionPct,
  prodCut,
  prodFab,
  prodLac,
  prodLacControl,
  canStartProduction,
  cutlistGenerated,
  cutlistResult,
  onProdCutChange,
  onProdFabChange,
  onProdLacChange,
  onProdLacControlChange,
  onOpenWorkOrderModal,
  highlightProdCut,
  highlightProdFab,
  highlightProdLac,
  highlightProdLacControl,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
}: {
  productionPct: number;
  prodCut: boolean;
  prodFab: boolean;
  prodLac: boolean;
  prodLacControl: boolean;
  canStartProduction: boolean;
  cutlistGenerated: boolean;
  cutlistResult: boolean;
  onProdCutChange: (value: boolean) => void;
  onProdFabChange: (value: boolean) => void;
  onProdLacChange: (value: boolean) => void;
  onProdLacControlChange: (value: boolean) => void;
  onOpenWorkOrderModal: () => void;
  highlightProdCut?: boolean;
  highlightProdFab?: boolean;
  highlightProdLac?: boolean;
  highlightProdLacControl?: boolean;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
}) => (
  <section className="p-6 rounded-2xl" style={cardStyle}>
    <SectionTitle n="05" label="Producción" />
    <div className="flex items-center gap-3 mb-4">
      <div className="h-2 w-40 rounded-full" style={{ background: uiColors.border, overflow: 'hidden' }}>
        <div className="h-full" style={{ width: `${productionPct}%`, background: uiColors.accent }} />
      </div>
      <span className="text-xs font-bold" style={{ color: uiColors.textSubtle }}>{productionPct}%</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          border: `1px solid ${highlightProdCut ? 'var(--danger)' : uiColors.border}`,
          background: highlightProdCut ? 'var(--danger-bg)' : '#f9fafb',
        }}
      >
        <input
          type="checkbox"
          checked={prodCut}
          onChange={e => onProdCutChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: uiColors.textPrimary }}>Corte</span>
      </label>
      <label
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          border: `1px solid ${highlightProdFab ? 'var(--danger)' : uiColors.border}`,
          background: highlightProdFab ? 'var(--danger-bg)' : '#f9fafb',
        }}
      >
        <input
          type="checkbox"
          checked={prodFab}
          onChange={e => onProdFabChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: uiColors.textPrimary }}>Fabricación</span>
      </label>
      <label
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          border: `1px solid ${highlightProdLac ? 'var(--danger)' : uiColors.border}`,
          background: highlightProdLac ? 'var(--danger-bg)' : '#f9fafb',
        }}
      >
        <input
          type="checkbox"
          checked={prodLac}
          onChange={e => onProdLacChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: uiColors.textPrimary }}>Lacado</span>
      </label>
      <label
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          border: `1px solid ${highlightProdLacControl ? 'var(--danger)' : uiColors.border}`,
          background: highlightProdLacControl ? 'var(--danger-bg)' : '#f9fafb',
        }}
      >
        <input
          type="checkbox"
          checked={prodLacControl}
          onChange={e => onProdLacControlChange(e.target.checked)}
          disabled={!canStartProduction}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: uiColors.textPrimary }}>Control paso lacado</span>
      </label>
    </div>
    {!canStartProduction && (
      <p className="text-xs mt-3" style={{ color: uiColors.textGhost }}>
        Producción habilitada tras aprobación y desarrollo.
      </p>
    )}
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-primary"
        disabled={!cutlistGenerated || !cutlistResult}
        onClick={onOpenWorkOrderModal}
        style={{ opacity: cutlistGenerated && cutlistResult ? 1 : 0.5, cursor: cutlistGenerated && cutlistResult ? 'pointer' : 'not-allowed' }}
      >
        Imprimir orden de trabajo
      </button>
      {!cutlistGenerated && (
        <span className="text-xs font-semibold" style={{ color: uiColors.textGhost }}>
          Genera el despiece para habilitar la impresión.
        </span>
      )}
    </div>
    {onAdvanceStep && (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onAdvanceStep}
          disabled={!canAdvanceStep}
          style={{ opacity: canAdvanceStep ? 1 : 0.5, cursor: canAdvanceStep ? 'pointer' : 'not-allowed' }}
          title={advanceHint || undefined}
        >
          <span className="text-base">➡️</span>
          Avanzar etapa{nextStepLabel ? ` · ${nextStepLabel}` : ''}
        </button>
        {advanceHint && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: uiColors.textGhost }}>
            {advanceHint}
          </span>
        )}
      </div>
    )}
  </section>
);
