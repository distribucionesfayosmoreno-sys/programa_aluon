import type { CatalogDoorProduct, CatalogModel, CatalogVariant } from '../BudgetWizard.types';
import { variantImageByDoorType } from '../budgetWizardImages';

type Props = {
  model: CatalogModel;
  product: CatalogDoorProduct;
  variants: CatalogVariant[];
  loading: boolean;
  onBack: () => void;
  onSelect: (variant: CatalogVariant) => void;
};

const variantLabel = (variant: CatalogVariant['variante']): string => {
  switch (variant) {
    case 'PEATONAL':
      return 'Peatonal';
    case 'ABATIBLE_UNA':
      return 'Abatible (1 hoja)';
    case 'ABATIBLE_DOS':
      return 'Abatible (2 hojas)';
    case 'CORREDERA':
      return 'Corredera';
    case 'VALLA':
      return 'Valla';
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
};

export const BudgetWizardVariantStep = ({ model, product, variants, loading, onBack, onSelect }: Props) => (
  <section className="grid gap-4">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Tipo de apertura</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}> {model.modelo} · {product.producto}</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Volver</button>
    </div>

    {loading && (
      <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Cargando aperturas…</div>
    )}

    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {variants.map(variant => (
        <button
          key={variant.id}
          className="text-left rounded-2xl overflow-hidden transition-all"
          style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
          onClick={() => onSelect(variant)}
        >
          <img src={variantImageByDoorType(variant.variante)} alt={variantLabel(variant.variante)} className="h-36 w-full object-cover" />
          <div className="p-4">
            <div className="text-sm font-black" style={{ color: '#0d1117' }}>{variantLabel(variant.variante)}</div>
            <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>Imagen: {variant.imagenVariante ?? 'default'}</div>
          </div>
        </button>
      ))}
    </div>
  </section>
);

