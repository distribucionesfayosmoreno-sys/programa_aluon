import { cardStyle, SectionTitle, uiColors } from '../components/ui';

export const FinalSection = ({
  finalized,
  ready,
  canFinalize,
  onFinalizedChange,
  onReadyChange,
}: {
  finalized: boolean;
  ready: 'PICKUP' | 'SHIPPING' | '';
  canFinalize: boolean;
  onFinalizedChange: (value: boolean) => void;
  onReadyChange: (value: 'PICKUP' | 'SHIPPING' | '') => void;
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
  </section>
);
