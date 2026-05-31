import type { ColorHex } from '../BudgetWizard.types';

type Props = {
  color: ColorHex;
  primerRequired: boolean;
  onColorChange: (color: ColorHex) => void;
  onPrimerChange: (required: boolean) => void;
  onBack: () => void;
  onNext: () => void;
};

const predefColors: { hex: ColorHex; label: string }[] = [
  { hex: '#ffffff', label: 'Blanco Silke' },
  { hex: '#000000', label: 'Negro Forja' },
  { hex: '#708090', label: 'Gris Pizarra' },
  { hex: '#8b4513', label: 'Marrón Óxido' },
];

export const BudgetWizardColorStep = ({
  color,
  primerRequired,
  onColorChange,
  onPrimerChange,
  onBack,
  onNext,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Paso 3 de 5</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5">Color & Imprimación</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver
        </button>
      </div>

      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 space-y-4">
        {/* Color Palette */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block mb-3">
            Selecciona un color
          </span>
          <div className="grid grid-cols-4 gap-3">
            {predefColors.map(c => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onColorChange(c.hex)}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all active:scale-90"
                style={{
                  backgroundColor: c.hex,
                  borderColor: color === c.hex ? 'var(--ag-primary)' : 'transparent',
                  boxShadow: color === c.hex ? '0 0 8px rgba(59, 130, 246, 0.4)' : 'none',
                }}
                title={c.label}
              >
                {color === c.hex && (
                  <span
                    className="material-symbols-outlined text-sm font-black"
                    style={{ color: c.hex === '#ffffff' ? '#000000' : '#ffffff' }}
                  >
                    done
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Hex input */}
        <div className="pt-2">
          <label htmlFor="custom-color" className="text-[10px] uppercase tracking-widest text-secondary font-bold block mb-2">
            Código hexadecimal personalizado
          </label>
          <div className="flex gap-2">
            <input
              id="custom-color"
              type="text"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs w-full focus:ring-1 focus:ring-primary outline-none"
              placeholder="#ffffff"
              value={color}
              onChange={e => onColorChange(e.target.value as ColorHex)}
            />
            <div className="w-11 h-11 rounded-xl border border-outline-variant/40" style={{ backgroundColor: color }} />
          </div>
        </div>

        <div className="h-px bg-outline-variant/20" />

        {/* Primer Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none py-1">
          <input
            type="checkbox"
            checked={primerRequired}
            onChange={e => onPrimerChange(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant text-blue-600 focus:ring-primary"
          />
          <div>
            <span className="text-xs font-black text-on-surface block">¿Necesita imprimación previa?</span>
            <span className="text-[10px] text-secondary mt-0.5 block">
              Tratamiento anticorrosión recomendado para exteriores húmedos.
            </span>
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 px-6 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Continuar a medidas
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>

  );
};
