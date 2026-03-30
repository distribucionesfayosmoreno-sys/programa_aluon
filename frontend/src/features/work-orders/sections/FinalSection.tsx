import { cardStyle, SectionTitle, uiColors } from '../components/ui';

export const FinalSection = ({
  finalized,
  ready,
  canFinalize,
  onFinalizedChange,
  onReadyChange,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
  onFinalizeOrder,
  canPersistFinal,
}: {
  finalized: boolean;
  ready: 'PICKUP' | 'SHIPPING' | '';
  canFinalize: boolean;
  onFinalizedChange: (value: boolean) => void;
  onReadyChange: (value: 'PICKUP' | 'SHIPPING' | '') => void;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
  onFinalizeOrder?: () => void;
  canPersistFinal?: boolean;
}) => (
  <section className="p-6 rounded-2xl" style={cardStyle}>
    <SectionTitle n="06" label="Finalización" />
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={finalized}
          onChange={e => onFinalizedChange(e.target.checked)}
          disabled={!canFinalize}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-bold uppercase" style={{ color: uiColors.textPrimary }}>Producto finalizado</span>
      </label>
      <select
        className="field"
        value={ready}
        onChange={e => onReadyChange(e.target.value as 'PICKUP' | 'SHIPPING' | '')}
        disabled={!finalized}
        style={{ maxWidth: 220, opacity: finalized ? 1 : 0.5 }}
      >
        <option value="">Listo para...</option>
        <option value="PICKUP">Recogida</option>
        <option value="SHIPPING">Envío</option>
      </select>
    </div>
    {!canFinalize && (
      <p className="text-xs mt-3" style={{ color: uiColors.textGhost }}>
        Finalización disponible al completar producción.
      </p>
    )}
    {onFinalizeOrder && (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onFinalizeOrder}
          disabled={!canPersistFinal}
          style={{ opacity: canPersistFinal ? 1 : 0.5, cursor: canPersistFinal ? 'pointer' : 'not-allowed' }}
        >
          <span className="text-base">✅</span>
          Orden finalizada
        </button>
        {!canPersistFinal && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: uiColors.textGhost }}>
            Completa producción y selecciona recogida o envío.
          </span>
        )}
      </div>
    )}
    {onAdvanceStep && nextStepLabel && (
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
          Avanzar etapa · {nextStepLabel}
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
