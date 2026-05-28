import type { CatalogModel } from '../BudgetWizard.types';
import { modelImageByDoorModel } from '../budgetWizardImages';

type Props = {
  models: CatalogModel[];
  loading: boolean;
  onSelect: (model: CatalogModel) => void;
};

export const BudgetWizardModelStep = ({ models, loading, onSelect }: Props) => (
  <section className="grid gap-4">
    <div>
      <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Modelo</h2>
      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Selecciona un modelo para empezar el presupuesto.</p>
    </div>

    {loading && (
      <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Cargando catálogo…</div>
    )}

    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {models.map(model => (
        <button
          key={model.id}
          className="text-left rounded-2xl overflow-hidden transition-all"
          style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
          onClick={() => onSelect(model)}
        >
          <img src={modelImageByDoorModel(model.modelo)} alt={model.modelo} className="h-36 w-full object-cover" />
          <div className="p-4">
            <div className="text-sm font-black" style={{ color: '#0d1117' }}>{model.modelo}</div>
            <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>Catálogo: {model.imagenModelo ?? 'default'}</div>
          </div>
        </button>
      ))}
    </div>
  </section>
);

