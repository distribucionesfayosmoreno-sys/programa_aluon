import { useState } from 'react';
import type { QuoteItemDraft } from '../BudgetWizard.types';
import { BudgetWizardDetailModal } from '../components/BudgetWizardDetailModal';

type Props = {
  savedItems: QuoteItemDraft[];
  itemDraft: QuoteItemDraft | null;
  onAddDoor: () => void;
  onRemoveDoor: (index: number) => void;
  onEditDoor: (index: number) => void;
  onReset: () => void;
  onFinalize: () => void;
  submitting: boolean;
};

export const BudgetWizardOptionsStep = ({
  savedItems,
  itemDraft,
  onAddDoor,
  onRemoveDoor,
  onEditDoor,
  onReset,
  onFinalize,
  submitting,
}: Props) => {
  const [detailOpen, setDetailOpen] = useState(false);

  // Unificamos los items guardados y el item actual en curso si no ha sido guardado
  const allItems = [...savedItems];
  if (itemDraft && allItems.length === 0) {
    allItems.push(itemDraft);
  }

  return (
    <section className="grid gap-6 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="text-center md:text-left">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Paso Final</span>
        <h2 className="text-2xl font-black text-gray-900 mt-1">¿Qué desea hacer?</h2>
        <p className="text-xs text-gray-500 mt-1">
          Cierre el presupuesto, y elíjase qué hacer, o consulte su detalle cuando lo necesite.
        </p>
      </div>

      {/* Continuar Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Continuar</span>
        <button
          type="button"
          disabled={submitting}
          onClick={onFinalize}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all duration-200"
          style={{
            backgroundColor: '#a92f32',
            boxShadow: '0 4px 14px rgba(169, 47, 50, 0.35)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8c2427';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#a92f32';
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {submitting ? 'Guardando...' : 'GUARDAR PRESUPUESTO'}
        </button>

        <button
          type="button"
          onClick={onAddDoor}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-gray-300 text-gray-700 font-black text-xs uppercase tracking-widest bg-white hover:bg-gray-50 transition-colors"
        >
          Añadir otra puerta
        </button>
      </div>

      {/* Líneas en presupuesto */}
      {allItems.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">
            Líneas en el presupuesto
          </span>
          <div className="bg-white rounded-2xl border border-gray-150 divide-y divide-gray-100 overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Resumen del presupuesto
            </div>
            {allItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-100 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-900">
                      Portón/berja {idx + 1} — {item.doorModel}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                      {item.productCategory.replace('_', ' ')} · {item.doorType} · {item.widthMm}x{item.heightMm} mm
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Editar puerta"
                    onClick={() => onEditDoor(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Eliminar puerta"
                    onClick={() => onRemoveDoor(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consultar o comenzar */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">
          Consultar o comenzar
        </span>

        <div className="grid gap-3">
          {/* Ver detalle */}
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-150 text-left hover:bg-gray-100/70 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#a92f32] bg-red-50 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-black text-gray-900">Ver detalle del presupuesto</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Abra una pestaña con todas las especificaciones</div>
            </div>
          </button>

          {/* Empezar de nuevo */}
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-150 text-left hover:bg-gray-100/70 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 bg-gray-200 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-black text-gray-900">Empezar el presupuesto de nuevo</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Se eliminan todas las puertas guardadas</div>
            </div>
          </button>
        </div>
      </div>

      <BudgetWizardDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        items={allItems}
      />
    </section>
  );
};
