import type { CatalogDoorProduct, CatalogModel, CatalogVariant } from '../BudgetWizard.types';
import { budgetWizardIdeasImagePath, budgetWizardPublicPath, budgetWizardStaticImagePath } from '../utils/budgetWizardAssetPath';

type Props = {
  model: CatalogModel;
  product: CatalogDoorProduct;
  variant: CatalogVariant;
  color: string;
  primerRequired: boolean;
  widthMm: number;
  heightMm: number;
  floorClearanceMm: number;
  larguero: boolean;
  marcoSuperior: boolean;
  bisagras: boolean;
  porteroAutomatico: boolean;
  submitting: boolean;
  onBack: () => void;
  onFinalize: () => void;
};

const yesNo = (val: boolean) => (val ? 'Sí' : 'No');

const getStructureImageLabel = (doorType: string): string => {
  switch (doorType) {
    case 'PEATONAL': return 'Puerta';
    case 'VALLA': return 'Valla';
    case 'CORREDERA': return 'Puerta Corredera';
    case 'ABATIBLE_UNA': return 'Puerta Abatible Una Hoja';
    case 'ABATIBLE_DOS': return 'Puerta Abatible Dos Hojas';
    default: return 'Puerta';
  }
};

const getProductImage = (modelo: string, doorType: string) => {
  const modelCamel = modelo.charAt(0).toUpperCase() + modelo.slice(1).toLowerCase();
  const label = getStructureImageLabel(doorType);
  return budgetWizardIdeasImagePath(`Modelo ${modelCamel} - ${label}.png`);
};

const getOpeningImage = (doorType: string, bisagras: boolean) => {
  if (doorType === 'VALLA') return null;
  const side: 'LEFT' | 'RIGHT' = bisagras ? 'RIGHT' : 'LEFT';
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

export const BudgetWizardSummaryStep = ({
  model,
  product,
  variant,
  color,
  primerRequired,
  widthMm,
  heightMm,
  floorClearanceMm,
  larguero,
  marcoSuperior,
  bisagras,
  porteroAutomatico,
  submitting,
  onBack,
  onFinalize,
}: Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Resumen de puerta</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5">Revisa el diseño</h3>
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

      {/* Visual Preview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Product structure image card */}
        <div className="relative h-32 bg-white border border-outline-variant/25 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-3 shadow-sm">
          <img
            src={getProductImage(model.modelo, variant.variante)}
            alt={variant.variante}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('Modelo Bisel')) {
                const label = getStructureImageLabel(variant.variante);
                target.src = budgetWizardIdeasImagePath(`Modelo Bisel - ${label}.png`);
              }
            }}
          />
          <div className="absolute bottom-2 right-3 text-[9px] uppercase tracking-widest text-secondary font-space">
            Estructura
          </div>
        </div>

        {/* Opening image card */}
        {variant.variante !== 'VALLA' ? (
          <div className="relative h-32 bg-white border border-outline-variant/25 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-3 shadow-sm">
            <img
              src={budgetWizardPublicPath('assets/template.png')}
              alt="Template"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <img
              src={getOpeningImage(variant.variante, bisagras) || ''}
              alt="Sentido de Apertura"
              className={`max-h-[80%] max-w-[85%] object-contain relative z-10 ${
                bisagras ? 'transform scale-[1.65] mix-blend-multiply' : ''
              }`}
            />
            <div className="absolute bottom-2 right-3 text-[9px] uppercase tracking-widest text-secondary font-space z-10">
              Apertura
            </div>
          </div>
        ) : (
          <div className="h-32 bg-surface-container/50 border border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center p-3 text-center">
            <span className="material-symbols-outlined text-secondary text-lg">block</span>
            <span className="text-[9px] uppercase tracking-wider text-secondary font-space mt-1">Sin apertura</span>
          </div>
        )}
      </div>

      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 space-y-4 text-xs text-on-surface">
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Modelo</span>
          <span className="font-bold">{model.modelo}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Tipo Cerramiento</span>
          <span className="font-bold">{product.producto.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Apertura</span>
          <span className="font-bold">{variant.variante}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Color Acabado</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">{color}</span>
            <div className="w-4 h-4 rounded-full border border-outline-variant/40" style={{ backgroundColor: color }} />
          </div>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Imprimación</span>
          <span className="font-bold">{yesNo(primerRequired)}</span>
        </div>

        <div className="h-px bg-outline-variant/20" />

        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Dimensiones</span>
          <span className="font-bold">{widthMm} x {heightMm} mm</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Holgura suelo</span>
          <span className="font-bold">{floorClearanceMm} mm</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Larguero de refuerzo</span>
          <span className="font-bold">{yesNo(larguero)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Marco superior</span>
          <span className="font-bold">{yesNo(marcoSuperior)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Bisagras</span>
          <span className="font-bold">{yesNo(bisagras)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary font-medium">Portero automático</span>
          <span className="font-bold">{yesNo(porteroAutomatico)}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={onFinalize}
        className="w-full py-3.5 px-6 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >

        {submitting ? 'Guardando...' : 'Aceptar y Guardar Puerta'}
        <span className="material-symbols-outlined text-sm">done_all</span>
      </button>
    </div>
  );
};
