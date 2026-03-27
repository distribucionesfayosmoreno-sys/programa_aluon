import { PRODUCT_TYPES } from './constants';
import type { CatalogCard, ProductTypeCard } from './models';

type CustomerOnboardingTypeProps = {
  selectedModelCard: CatalogCard;
  onSelectType: (card: ProductTypeCard) => void;
  onBack: () => void;
};

export const CustomerOnboardingType = ({ selectedModelCard, onSelectType, onBack }: CustomerOnboardingTypeProps) => (
  <section className="grid gap-4">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Tipo de producto</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Modelo seleccionado: {selectedModelCard.label}</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Cambiar modelo</button>
    </div>

    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {PRODUCT_TYPES.map(card => (
        <button
          key={card.id}
          className="text-left rounded-2xl overflow-hidden transition-all"
          style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
          onClick={() => onSelectType(card)}
        >
          <img src={card.image} alt={card.label} className="h-36 w-full object-cover" />
          <div className="p-4">
            <div className="text-sm font-black" style={{ color: '#0d1117' }}>{card.label}</div>
            <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>{card.description}</div>
          </div>
        </button>
      ))}
    </div>
  </section>
);
