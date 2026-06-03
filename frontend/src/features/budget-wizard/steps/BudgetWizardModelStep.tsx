import type { CatalogFamily } from '../BudgetWizard.types';
import { resolveFamilyCardImage } from '../budgetWizardCatalogMedia';

type Props = {
  families: CatalogFamily[];
  loading: boolean;
  onSelect: (family: CatalogFamily) => void;
};

export const BudgetWizardModelStep = ({ families, loading, onSelect }: Props) => {
  if (loading) {
    return <div className="text-xs text-secondary animate-pulse py-8 text-center font-body">Cargando familias del catálogo...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center md:text-left">
        <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Paso 1 de 5</span>
        <h3 className="font-headline font-bold text-2xl text-on-surface mt-1">Selecciona una familia</h3>
        <p className="text-xs text-secondary mt-1 font-body">
          Elige la familia que quieres mostrar en el presupuesto.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {families.map(family => (
          <button
            key={family.id}
            type="button"
            onClick={() => onSelect(family)}
            className="group relative flex flex-col justify-end text-left bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 active:scale-[0.98] shadow-sm h-80 w-full"
          >
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src={resolveFamilyCardImage(family)}
                alt={family.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 p-4 pt-10 space-y-1 bg-gradient-to-t from-white via-white/90 to-transparent w-full">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-on-surface tracking-wider uppercase font-space">
                  {family.name}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-secondary font-body">
                {family.description || 'Familia configurable desde administración.'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
