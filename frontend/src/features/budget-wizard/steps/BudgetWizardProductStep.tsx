import type { CatalogFamily, CatalogFamilyChild } from '../BudgetWizard.types';
import { resolveChildCardImage } from '../budgetWizardCatalogMedia';

type Props = {
  family: CatalogFamily;
  children: CatalogFamilyChild[];
  loading: boolean;
  onBack: () => void;
  onSelect: (child: CatalogFamilyChild) => void;
};

export const BudgetWizardProductStep = ({ family, children, loading, onBack, onSelect }: Props) => {
  if (loading) {
    return <div className="text-xs text-secondary animate-pulse py-8 text-center font-body">Cargando hijos de la familia...</div>;
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
        Estás configurando la familia <strong>{family.name}</strong>. Elige el tipo que aparecerá en el siguiente paso:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {children.map(child => (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelect(child)}
            className="group relative flex flex-col justify-end text-left bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 active:scale-[0.98] shadow-sm h-80 w-full"
          >
            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src={resolveChildCardImage(child)}
                alt={child.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 p-4 pt-10 space-y-1 bg-gradient-to-t from-white via-white/90 to-transparent w-full">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-on-surface tracking-wider uppercase font-space">
                  {child.name}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-secondary font-body">
                {child.description || 'Opción configurable desde administración.'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
