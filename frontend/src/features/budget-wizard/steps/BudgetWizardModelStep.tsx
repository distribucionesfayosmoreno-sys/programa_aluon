import type { CatalogModel } from '../BudgetWizard.types';
import { budgetWizardIdeasImagePath } from '../utils/budgetWizardAssetPath';

type Props = {
  models: CatalogModel[];
  loading: boolean;
  onSelect: (model: CatalogModel) => void;
};

const getModelImage = (modelo: string) => {
  const key = modelo.toUpperCase();
  switch (key) {
    case 'CLASSIC':
      return budgetWizardIdeasImagePath('aluonClassic.jpg');
    case 'BISEL':
      return budgetWizardIdeasImagePath('aluonBisel.jpg');
    case 'INOX':
      return budgetWizardIdeasImagePath('aluonInox.jpg');
    case 'PREMIUM':
      return budgetWizardIdeasImagePath('aluonPremium.jpg');
    case 'VENECIANA':
      return budgetWizardIdeasImagePath('aluonVeneciana.jpg');
    default:
      return budgetWizardIdeasImagePath('aluonClassic.jpg');
  }
};

export const BudgetWizardModelStep = ({ models, loading, onSelect }: Props) => {
  if (loading) {
    return <div className="text-xs text-secondary animate-pulse py-8 text-center font-body">Cargando modelos del catálogo...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center md:text-left">
        <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Paso 1 de 5</span>
        <h3 className="font-headline font-bold text-2xl text-on-surface mt-1">Selecciona un modelo</h3>
        <p className="text-xs text-secondary mt-1 font-body">
          Elige la línea estética para tu puerta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.map(model => (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelect(model)}
            className="group relative flex flex-col justify-end text-left bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 active:scale-[0.98] shadow-sm h-80 w-full"
          >
            {/* Image container serving as full background */}
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
              {model.modelo ? (
                <img
                  src={getModelImage(model.modelo)}
                  alt={model.modelo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="relative z-10 text-xs text-slate-800 uppercase font-black">
                  {model.modelo}
                </div>
              )}
            </div>

            {/* Text Overlay exactly as requested */}
            <div className="relative z-10 p-4 pt-10 space-y-1 bg-gradient-to-t from-white via-white/90 to-transparent w-full">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-on-surface tracking-wider uppercase font-space">
                  Serie {model.modelo}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-secondary font-body">
                Acabados en aluminio de alta durabilidad y diseño moderno.
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
