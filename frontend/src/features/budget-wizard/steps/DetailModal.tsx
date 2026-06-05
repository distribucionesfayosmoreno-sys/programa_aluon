import type { QuoteItemDraft } from "../BudgetWizard.types";
import { resolveChildCardImage } from '../budgetWizardCatalogMedia';
import { budgetWizardPublicPath, budgetWizardStaticImagePath } from '../utils/budgetWizardAssetPath';
import AppDialog from '../../../components/feedback/AppDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItemDraft[];
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

const yesNo = (val: boolean) => (val ? "Sí" : "No");

export const DetailModal = ({ isOpen, onClose, items }: Props) => {
  if (!isOpen) return null;

  return (
    <AppDialog
      open={isOpen}
      title="Detalle del pedido"
      subtitle="Especificaciones de tus puertas."
      onClose={onClose}
      maxWidthClassName="max-w-lg"
      actions={
        <button
          type="button"
          className="px-5 py-2 bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors"
          onClick={onClose}
        >
          Cerrar detalle
        </button>
      }
    >
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="border-b border-outline-variant/10 pb-5 last:border-0 last:pb-0 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              Línea #{idx + 1} — {item.familyName}
            </div>

            {/* Visual Preview Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Product structure image card */}
              <div className="relative h-24 bg-white border border-outline-variant/25 rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 shadow-sm">
                <img
                  src={resolveChildCardImage({
                    id: item.catalogChildId,
                    familyId: item.catalogFamilyId,
                    productCategory: item.productCategory,
                    doorType: item.doorType,
                    name: item.childName,
                    description: null,
                    imageUrl: null,
                  })}
                  alt={item.childName}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-secondary font-space">
                  Estructura
                </div>
              </div>

              {/* Opening image card */}
              {item.doorType !== 'VALLA' ? (
                <div className="relative h-24 bg-white border border-outline-variant/25 rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 shadow-sm">
                  <img
                    src={budgetWizardPublicPath('assets/template.png')}
                    alt="Template"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <img
                    src={getOpeningImage(item.doorType, item.bisagras) || ''}
                    alt="Apertura"
                    className={`max-h-[80%] max-w-[85%] object-contain relative z-10 ${
                      item.bisagras ? 'transform scale-[1.65] mix-blend-multiply' : ''
                    }`}
                  />
                  <div className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-secondary font-space z-10">
                    Apertura
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-surface-container/50 border border-outline-variant/20 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <span className="material-symbols-outlined text-secondary text-base">block</span>
                  <span className="text-[8px] uppercase tracking-wider text-secondary font-space mt-1">Sin apertura</span>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/20">
                <div className="divide-y divide-outline-variant/10 text-xs text-secondary">
                  <div className="flex justify-between py-2 px-1">
                  <span>Familia</span>
                  <span className="font-bold text-on-surface">{item.familyName}</span>
                  </div>
                  <div className="flex justify-between py-2 px-1">
                  <span>Tipo</span>
                  <span className="font-bold text-on-surface">{item.childName}</span>
                  </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Medidas</span>
                  <span className="font-bold text-on-surface">{item.widthMm} x {item.heightMm} mm</span>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-on-surface">{item.colorCode}</span>
                    <div className="w-3.5 h-3.5 rounded-full border border-outline-variant/30" style={{ backgroundColor: item.colorCode }} />
                  </div>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Imprimación</span>
                  <span className="font-bold text-on-surface">{yesNo(item.primerRequired)}</span>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Refuerzo Larguero</span>
                  <span className="font-bold text-on-surface">{yesNo(item.larguero)}</span>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Marco Superior</span>
                  <span className="font-bold text-on-surface">{yesNo(item.marcoSuperior)}</span>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Bisagras</span>
                  <span className="font-bold text-on-surface">{yesNo(item.bisagras)}</span>
                </div>
                <div className="flex justify-between py-2 px-1">
                  <span>Portero Automático</span>
                  <span className="font-bold text-on-surface">{yesNo(item.porteroAutomatico)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppDialog>
  );
};
