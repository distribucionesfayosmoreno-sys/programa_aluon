import type { CatalogModel } from '../BudgetWizard.types';
import { budgetWizardIdeasImagePath, budgetWizardPublicPath } from '../utils/budgetWizardAssetPath';

type Props = {
  model: CatalogModel;
  doorType: string;
  bisagras: boolean;
  onSelect: (val: boolean) => void;
  onBack: () => void;
};

export const BudgetWizardVariantStep = ({ model, doorType, bisagras, onSelect, onBack }: Props) => {
  const isTwoLeaves = doorType === 'ABATIBLE_DOS';

  const options = [
    {
      value: false,
      label: 'Izquierda',
      image: isTwoLeaves
        ? budgetWizardIdeasImagePath('abatible dos hojas izquierda.avif')
        : budgetWizardIdeasImagePath('izquierda.avif'),
      imgClass: ''
    },
    {
      value: true,
      label: 'Derecha',
      image: isTwoLeaves
        ? budgetWizardIdeasImagePath('abatible dos hojas derecha.jpg')
        : budgetWizardIdeasImagePath('derecha.jpg'),
      imgClass: 'transform scale-[1.65] mix-blend-multiply'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold font-space">Paso 4 de 5</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5 font-space">Forma de Apertura</h3>
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
        Selecciona el sentido de apertura o lado de bisagras para tu cerramiento modelo **{model.modelo}**:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map(opt => {
          const isSelected = bisagras === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`group relative flex flex-col justify-between text-left bg-white rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.98] shadow-sm h-44 w-full ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-slate-200 hover:border-primary'
              }`}
            >
              {/* Template background */}
              <img
                src={budgetWizardPublicPath('assets/template.png')}
                alt="Template"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                {/* Image Container (top part, centered, no overlap with text) */}
                <div className="flex-1 flex items-center justify-center p-3 min-h-0">
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className={`max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500 ${opt.imgClass}`}
                  />
                </div>

                {/* Text Overlay */}
                <div className="p-3 pt-6 space-y-0.5 bg-gradient-to-t from-white via-white/95 to-transparent w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-on-surface tracking-wider uppercase font-space">
                      Apertura {opt.label}
                    </span>
                  </div>
                  <p className="text-[9px] leading-relaxed text-secondary font-body">
                    Sentido de apertura {opt.label.toLowerCase()} según especificación.
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
