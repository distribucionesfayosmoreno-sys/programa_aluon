import type { CatalogDoorProduct, CatalogModel, ColorHex } from '../BudgetWizard.types';
import { DoorPreview } from '../components/DoorPreview';

type Props = {
  model: CatalogModel;
  product: CatalogDoorProduct;
  color: ColorHex;
  primerRequired: boolean;
  onColorChange: (value: ColorHex) => void;
  onPrimerChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
};

export const BudgetWizardColorStep = ({
  model,
  product,
  color,
  primerRequired,
  onColorChange,
  onPrimerChange,
  onNext,
  onBack,
}: Props) => (
  <section className="grid gap-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Color e imprimación</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}> {model.modelo} · {product.producto}</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Cambiar tipo</button>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <DoorPreview color={color} />
        <div className="text-xs mt-3" style={{ color: '#9ca3af' }}>Vista previa (placeholder): puerta blanca con cambio de color.</div>
      </div>

      <div className="rounded-2xl p-6 grid gap-4" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <div>
          <label className="field-label">Color</label>
          <div className="flex items-center gap-3">
            <input
              className="h-10 w-14 rounded-xl overflow-hidden"
              type="color"
              value={color}
              onChange={e => onColorChange(e.target.value as ColorHex)}
              aria-label="Selector de color"
              title="Selecciona un color"
            />
            <input className="field flex-1" type="text" value={color} readOnly aria-label="Color seleccionado" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#0d1117' }}>
          <input
            type="checkbox"
            checked={primerRequired}
            onChange={e => onPrimerChange(e.target.checked)}
          />
          Necesita imprimación
        </label>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={onNext}>Siguiente</button>
        </div>
      </div>
    </div>
  </section>
);
