import type { CatalogModel } from '../BudgetWizard.types';

type Props = {
  model: CatalogModel;
  loading: boolean;
  onBack: () => void;
  onSelect: (category: string, type: string) => void;
};

const structures = [
  { id: 'puerta', label: 'Puerta', imageLabel: 'Puerta', category: 'PUERTA_PASO', type: 'PEATONAL' },
  { id: 'valla', label: 'Valla', imageLabel: 'Valla', category: 'VALLA', type: 'VALLA' },
  { id: 'corredera', label: 'Puerta Corredera', imageLabel: 'Puerta Corredera', category: 'PUERTA_GARAJE', type: 'CORREDERA' },
  { id: 'abatible_una', label: 'Puerta Abatible Una Hoja', imageLabel: 'Puerta Abatible Una Hoja', category: 'PUERTA_PASO', type: 'ABATIBLE_UNA' },
  { id: 'abatible_dos', label: 'Puerta Abatible Dos Hojas', imageLabel: 'Puerta Abatible Dos Hojas', category: 'PUERTA_PASO', type: 'ABATIBLE_DOS' }
];

const getProductImage = (modelo: string, imageLabel: string) => {
  const modelCamel = modelo.charAt(0).toUpperCase() + modelo.slice(1).toLowerCase();
  return `/ideas/aluon/images/Modelo ${modelCamel} - ${imageLabel}.png`;
};

export const BudgetWizardProductStep = ({ model, loading, onBack, onSelect }: Props) => {
  if (loading) {
    return <div className="text-xs text-secondary animate-pulse py-8 text-center font-body">Cargando estructuras...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold font-space">Paso 2 de 5</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5 font-space">Tipo de estructura</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1 active:scale-95 transition-transform font-space"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver
        </button>
      </div>

      <p className="text-xs text-secondary font-body">
        Estás configurando un producto del **Modelo {model.modelo}**. Elige el tipo de estructura:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {structures.map(structure => (
          <button
            key={structure.id}
            type="button"
            onClick={() => onSelect(structure.category, structure.type)}
            className="group relative flex flex-col justify-end text-left bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 active:scale-[0.98] shadow-sm h-80 w-full"
          >
            {/* Image container serving as full background */}
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src={getProductImage(model.modelo, structure.imageLabel)}
                alt={structure.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('Modelo Bisel')) {
                    target.src = `/ideas/aluon/images/Modelo Bisel - ${structure.imageLabel}.png`;
                  }
                }}
              />
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 p-4 pt-10 space-y-1 bg-gradient-to-t from-white via-white/90 to-transparent w-full">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-on-surface tracking-wider uppercase font-space">
                  {structure.label}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-secondary font-body">
                Especificaciones de cerramientos de aluminio y acabados de alta calidad.
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
