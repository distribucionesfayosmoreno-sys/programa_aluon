import type { CatalogCard, ProductTypeCard } from './models';

type CustomerOnboardingMeasurementsProps = {
  selectedModelCard: CatalogCard;
  selectedTypeCard: ProductTypeCard;
  widthMm: number;
  heightMm: number;
  m2: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onAddItem: () => void;
  onAddOtherType: () => void;
  onBack: () => void;
};

export const CustomerOnboardingMeasurements = ({
  selectedModelCard,
  selectedTypeCard,
  widthMm,
  heightMm,
  m2,
  onWidthChange,
  onHeightChange,
  onAddItem,
  onAddOtherType,
  onBack,
}: CustomerOnboardingMeasurementsProps) => (
  <section className="grid gap-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Medidas y confirmación</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
          {selectedModelCard.label} · {selectedTypeCard.label}
        </p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Cambiar tipo</button>
    </div>

    <div className="rounded-2xl p-6 grid gap-4" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Ancho (mm)</label>
          <input
            className="field"
            type="number"
            min={1}
            value={widthMm || ''}
            onChange={e => onWidthChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="field-label">Alto (mm)</label>
          <input
            className="field"
            type="number"
            min={1}
            value={heightMm || ''}
            onChange={e => onHeightChange(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="text-xs" style={{ color: '#9ca3af' }}>
        Superficie estimada: <strong style={{ color: '#0d1117' }}>{m2.toFixed(2)} m²</strong>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={onAddItem}>Añadir producto</button>
        <button className="btn-ghost" onClick={onAddOtherType}>Añadir otro tipo</button>
      </div>
    </div>
  </section>
);
