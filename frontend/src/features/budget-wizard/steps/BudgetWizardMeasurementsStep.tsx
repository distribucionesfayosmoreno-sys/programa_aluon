import type { CatalogModel, CatalogVariant } from '../BudgetWizard.types';

type Props = {
  model: CatalogModel;
  variant: CatalogVariant;
  widthMm: number;
  heightMm: number;
  floorClearanceMm: number;
  larguero: boolean;
  marcoSuperior: boolean;
  bisagras: boolean;
  porteroAutomatico: boolean;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onFloorClearanceChange: (value: number) => void;
  onLargueroChange: (value: boolean) => void;
  onMarcoSuperiorChange: (value: boolean) => void;
  onBisagrasChange: (value: boolean) => void;
  onPorteroAutomaticoChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
};

export const BudgetWizardMeasurementsStep = ({
  model,
  variant,
  widthMm,
  heightMm,
  floorClearanceMm,
  larguero,
  marcoSuperior,
  bisagras,
  porteroAutomatico,
  onWidthChange,
  onHeightChange,
  onFloorClearanceChange,
  onLargueroChange,
  onMarcoSuperiorChange,
  onBisagrasChange,
  onPorteroAutomaticoChange,
  onNext,
  onBack,
}: Props) => (
  <section className="grid gap-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Medidas</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{model.modelo} · {variant.variante}</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Cambiar apertura</button>
    </div>

    <div className="rounded-2xl p-6 grid gap-4" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Anchura total (mm)</label>
          <input className="field" type="number" min={1} value={widthMm || ''} onChange={e => onWidthChange(Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Altura total (mm)</label>
          <input className="field" type="number" min={1} value={heightMm || ''} onChange={e => onHeightChange(Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Holgura suelo (mm)</label>
          <input className="field" type="number" min={0} value={floorClearanceMm || ''} onChange={e => onFloorClearanceChange(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0d1117' }}>
          <input type="checkbox" checked={larguero} onChange={e => onLargueroChange(e.target.checked)} />
          Larguero
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0d1117' }}>
          <input type="checkbox" checked={marcoSuperior} onChange={e => onMarcoSuperiorChange(e.target.checked)} />
          Marco superior
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0d1117' }}>
          <input type="checkbox" checked={bisagras} onChange={e => onBisagrasChange(e.target.checked)} />
          Bisagras
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0d1117' }}>
          <input type="checkbox" checked={porteroAutomatico} onChange={e => onPorteroAutomaticoChange(e.target.checked)} />
          Portero automático
        </label>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" onClick={onNext}>Siguiente</button>
      </div>
    </div>
  </section>
);

