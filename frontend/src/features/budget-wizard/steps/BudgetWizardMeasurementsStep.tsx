
type Props = {
  stepText?: string;
  widthMm: number;
  heightMm: number;
  floorClearanceMm: number;
  larguero: boolean;
  marcoSuperior: boolean;
  porteroAutomatico: boolean;
  onWidthChange: (val: number) => void;
  onHeightChange: (val: number) => void;
  onFloorClearanceChange: (val: number) => void;
  onLargueroChange: (val: boolean) => void;
  onMarcoSuperiorChange: (val: boolean) => void;
  onPorteroAutomaticoChange: (val: boolean) => void;
  onBack: () => void;
  onNext: () => void;
};

export const BudgetWizardMeasurementsStep = ({
  stepText,
  widthMm,
  heightMm,
  floorClearanceMm,
  larguero,
  marcoSuperior,
  porteroAutomatico,
  onWidthChange,
  onHeightChange,
  onFloorClearanceChange,
  onLargueroChange,
  onMarcoSuperiorChange,
  onPorteroAutomaticoChange,
  onBack,
  onNext,
}: Props) => {
  const handleNext = () => {
    if (widthMm <= 0 || heightMm <= 0) {
      alert('Por favor introduce medidas válidas para ancho y alto.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">{stepText || 'Paso 5 de 5'}</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5">Dimensiones & Opciones</h3>
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

      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 space-y-6">
        {/* Numerical Dimensions */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">
            Medidas principales (mm)
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mobile-width" className="text-[10px] text-secondary font-bold block mb-1">Anchura Total</label>
              <input
                id="mobile-width"
                type="number"
                inputMode="numeric"
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs w-full focus:ring-1 focus:ring-primary outline-none"
                placeholder="Ancho (mm)"
                value={widthMm || ''}
                onChange={e => onWidthChange(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="mobile-height" className="text-[10px] text-secondary font-bold block mb-1">Altura Total</label>
              <input
                id="mobile-height"
                type="number"
                inputMode="numeric"
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs w-full focus:ring-1 focus:ring-primary outline-none"
                placeholder="Alto (mm)"
                value={heightMm || ''}
                onChange={e => onHeightChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobile-clearance" className="text-[10px] text-secondary font-bold block mb-1">Holgura Suelo (mm)</label>
            <input
              id="mobile-clearance"
              type="number"
              inputMode="numeric"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs w-full focus:ring-1 focus:ring-primary outline-none"
              placeholder="Holgura (mm)"
              value={floorClearanceMm || ''}
              onChange={e => onFloorClearanceChange(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="h-px bg-outline-variant/20" />

        {/* Options / Toggle Switches */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">
            Accesorios & Opciones
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3 bg-surface-container-high rounded-xl cursor-pointer">
              <span className="text-xs text-on-surface">Larguero de refuerzo</span>
              <input
                type="checkbox"
                checked={larguero}
                onChange={e => onLargueroChange(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-container-high rounded-xl cursor-pointer">
              <span className="text-xs text-on-surface">Marco superior</span>
              <input
                type="checkbox"
                checked={marcoSuperior}
                onChange={e => onMarcoSuperiorChange(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-primary"
              />
            </label>


            <label className="flex items-center justify-between p-3 bg-surface-container-high rounded-xl cursor-pointer">
              <span className="text-xs text-on-surface">Portero automático</span>
              <input
                type="checkbox"
                checked={porteroAutomatico}
                onChange={e => onPorteroAutomaticoChange(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-full py-3.5 px-6 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Continuar al Resumen
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>

    </div>
  );
};
