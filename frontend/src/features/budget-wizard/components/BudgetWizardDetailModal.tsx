import type { QuoteItemDraft } from '../BudgetWizard.types';
import { variantImageByDoorType } from '../budgetWizardImages';
import AppDialog from '../../../components/feedback/AppDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItemDraft[];
};

const yesNo = (val: boolean) => (val ? 'Sí' : 'No');

export const BudgetWizardDetailModal = ({ isOpen, onClose, items }: Props) => {
  if (!isOpen) return null;

  return (
    <AppDialog
      open={isOpen}
      title="Detalle del pedido"
      subtitle="Especificaciones técnicas y esquemas de apertura"
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
      actions={
        <button
          type="button"
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
          onClick={onClose}
        >
          Cerrar detalle
        </button>
      }
    >
      <div className="space-y-8">
        {items.map((item, idx) => {
          const schemeImg = variantImageByDoorType(item.doorType);

          return (
            <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
              <div className="text-xs font-black uppercase tracking-wider text-brand mb-4">
                Puerta #{idx + 1} — {item.productCategory.replace('_', ' ')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Visual Scheme & Basic Data */}
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center w-full">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                      Tipo de apertura
                    </span>
                    <span className="text-xs font-black text-gray-900 block mb-4">
                      Apertura {item.doorType}
                    </span>
                  </div>

                  {schemeImg ? (
                    <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 w-full max-w-sm flex items-center justify-center relative overflow-hidden" style={{ minHeight: '160px' }}>
                      <img
                        src={schemeImg}
                        alt={`Apertura ${item.doorType}`}
                        className="max-h-36 object-contain"
                      />
                      <div className="absolute bottom-2 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                        Medida de referencia
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 w-full max-w-sm flex items-center justify-center text-gray-400 text-xs">
                      Esquema no disponible
                    </div>
                  )}

                  <div className="w-full max-w-sm grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Modelo Puerta</span>
                      <span className="text-xs font-black text-gray-900 mt-1 block">{item.doorModel}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Color acabado</span>
                        <span className="text-xs font-black text-gray-900 mt-1 block">{item.colorCode}</span>
                      </div>
                      <div className="w-full h-3 rounded-full mt-2 border border-gray-300" style={{ backgroundColor: item.colorCode }} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Technical Specs Table */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-3 px-2">
                    Especificaciones técnicas
                  </span>

                  <div className="divide-y divide-gray-150 text-xs text-gray-700">
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Puerta</span>
                      <span className="font-black text-gray-900">{item.productCategory.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Tipo de apertura</span>
                      <span className="font-black text-gray-900">{item.doorType}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Ancho puerta</span>
                      <span className="font-black text-gray-900">{item.widthMm} mm</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Alto puerta</span>
                      <span className="font-black text-gray-900">{item.heightMm} mm</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Holgura suelo</span>
                      <span className="font-black text-gray-900">{item.floorClearanceMm} mm</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Imprimación</span>
                      <span className="font-black text-gray-900">{yesNo(item.primerRequired)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Larguero</span>
                      <span className="font-black text-gray-900">{yesNo(item.larguero)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Marco Superior</span>
                      <span className="font-black text-gray-900">{yesNo(item.marcoSuperior)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2">
                      <span className="font-medium text-gray-500">Bisagras</span>
                      <span className="font-black text-gray-900">{yesNo(item.bisagras)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-2 border-b border-gray-150">
                      <span className="font-medium text-gray-500">Portero Automático</span>
                      <span className="font-black text-gray-900">{yesNo(item.porteroAutomatico)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppDialog>
  );
};
