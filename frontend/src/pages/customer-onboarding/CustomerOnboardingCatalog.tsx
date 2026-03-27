import { CATALOG_MODELS } from './constants';
import type { CatalogCard } from './models';

type CustomerOnboardingCatalogProps = {
  onSelectModel: (card: CatalogCard) => void;
};

export const CustomerOnboardingCatalog = ({ onSelectModel }: CustomerOnboardingCatalogProps) => (
  <section className="grid gap-4">
    <div>
      <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Selecciona un modelo</h2>
      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Catálogo visual con acabados disponibles.</p>
    </div>
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {CATALOG_MODELS.map(card => (
        <button
          key={card.id}
          className="text-left rounded-2xl overflow-hidden transition-all"
          style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
          onClick={() => onSelectModel(card)}
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
