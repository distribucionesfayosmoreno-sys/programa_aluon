import type { CatalogModel } from '../BudgetWizard.types';
import { budgetWizardPublicPath, budgetWizardStaticImagePath } from '../utils/budgetWizardAssetPath';

type Props = {
  model: CatalogModel;
  doorType: string;
  bisagras: boolean;
  onSelect: (val: boolean) => void;
  onBack: () => void;
};

export const BudgetWizardVariantStep = ({ model, doorType, bisagras, onSelect, onBack }: Props) => {
  const openingImage = (side: 'LEFT' | 'RIGHT'): string | null => {
    if (doorType === 'VALLA') return null;
    if (doorType === 'CORREDERA') {
      return side === 'LEFT'
        ? budgetWizardStaticImagePath('corredera izquierda.png')
        : budgetWizardStaticImagePath('corredera derecha.png');
    }
    if (doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS') {
      return side === 'LEFT'
        ? budgetWizardStaticImagePath('abatible dos hojas izquierda.png')
        : budgetWizardStaticImagePath('apertura abatible dos hojas derecha.png');
    }
    return side === 'LEFT'
      ? budgetWizardStaticImagePath('apertura izquierda.png')
      : budgetWizardStaticImagePath('apertura derecha.png');
  };

  const options = [
    {
      value: false,
      label: 'Izquierda',
      image: openingImage('LEFT') ?? '',
      imgClass: ''
    },
    {
      value: true,
      label: 'Derecha',
      image: openingImage('RIGHT') ?? '',
      imgClass: ''
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
                {/* Image Container (full bleed) */}
                <div className="relative flex-1 min-h-0">
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className={`absolute inset-0 w-full h-full object-contain object-center ${opt.imgClass}`}
                  />

                  {/* Text Overlay (over image) */}
                  <div className="absolute inset-x-0 bottom-0 p-3 space-y-0.5 bg-transparent">
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
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
