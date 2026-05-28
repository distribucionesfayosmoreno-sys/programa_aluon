import type { CatalogDoorProduct, CatalogModel } from '../BudgetWizard.types';
import { productImageByCategory } from '../budgetWizardImages';

type Props = {
  model: CatalogModel;
  products: CatalogDoorProduct[];
  loading: boolean;
  onBack: () => void;
  onSelect: (product: CatalogDoorProduct) => void;
};

const categoryLabel = (category: CatalogDoorProduct['producto']): string => {
  switch (category) {
    case 'PUERTA_PASO':
      return 'Puerta paso';
    case 'PUERTA_GARAJE':
      return 'Puerta garaje';
    case 'VALLA':
      return 'Valla';
    case 'REJA':
      return 'Reja';
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
};

export const BudgetWizardProductStep = ({ model, products, loading, onBack, onSelect }: Props) => (
  <section className="grid gap-4">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Tipo de puerta</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Modelo seleccionado: {model.modelo}</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Cambiar modelo</button>
    </div>

    {loading && (
      <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Cargando tipos…</div>
    )}

    {!loading && products.length === 0 && (
      <div className="rounded-2xl p-6 text-xs font-semibold" style={{ background: '#ffffff', border: '1px solid #e8eaed', color: '#9ca3af' }}>
        No hay tipos configurados para este modelo todavía. Revisa el catálogo en BBDD (tabla `aluon_saas_catalogo_puertas`).
      </div>
    )}

    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {products.map(product => (
        <button
          key={product.id}
          className="text-left rounded-2xl overflow-hidden transition-all"
          style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
          onClick={() => onSelect(product)}
        >
          <img src={productImageByCategory(product.producto)} alt={categoryLabel(product.producto)} className="h-36 w-full object-cover" />
          <div className="p-4">
            <div className="text-sm font-black" style={{ color: '#0d1117' }}>{categoryLabel(product.producto)}</div>
            <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>Imagen: {product.imagenModelo ?? 'default'}</div>
          </div>
        </button>
      ))}
    </div>
  </section>
);
