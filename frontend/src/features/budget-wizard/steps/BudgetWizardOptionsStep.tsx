import { useState } from "react";
import type { QuoteItemDraft } from "../BudgetWizard.types";
import { DetailModal } from "./DetailModal.tsx";

type Props = {
  savedItems: QuoteItemDraft[];
  itemDraft: QuoteItemDraft | null;
  onAddDoor: () => void;
  onRemoveDoor: (index: number) => void;
  onEditDoor: (index: number) => void;
  onReset: () => void;
  onFinalize: () => void;
  onFinalizeAction?: (action: 'EMAIL' | 'WHATSAPP' | 'VIEW') => void;
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
  onFinalizeAction,
  submitting,
}: Props) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const canFinalize = savedItems.length > 0;

  const allItems = [...savedItems];
  if (itemDraft && allItems.length === 0) {
    allItems.push(itemDraft);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Paso Final</span>
        <h3 className="font-headline font-bold text-2xl text-on-surface mt-1">¿Qué desea hacer?</h3>
        <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
          Cierre el presupuesto, y elíjase qué hacer, o consulte su detalle cuando lo necesite.
        </p>
      </div>

      {/* Continuar Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">Continuar</span>
        <button
          type="button"
          disabled={submitting || !canFinalize}
          onClick={onFinalize}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">save</span>
          {submitting ? 'Guardando...' : 'FINALIZAR PRESUPUESTO'}
        </button>

        {/* Action Buttons underneath save button */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onFinalizeAction?.('EMAIL')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">mail</span>
            Enviar por Mail
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onFinalizeAction?.('WHATSAPP')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-green-600">chat</span>
            WhatsApp
          </button>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={() => onFinalizeAction?.('VIEW')}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-outline-variant text-on-surface font-black text-xs uppercase tracking-widest bg-surface hover:bg-surface-container transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm text-blue-500">visibility</span>
          Ver presupuesto
        </button>

        <button
          type="button"
          onClick={onAddDoor}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-outline-variant/60 text-on-surface font-black text-xs uppercase tracking-widest bg-surface hover:bg-surface-container transition-colors"
        >
          Añadir otra puerta
        </button>
      </div>

      {/* Líneas en presupuesto */}
      {allItems.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">
            Líneas en el presupuesto
          </span>
          <div className="bg-surface-container rounded-2xl border border-outline-variant/20 divide-y divide-outline-variant/20 overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 bg-surface-container-high text-[10px] uppercase tracking-wider text-secondary font-bold">
              Resumen del presupuesto
            </div>
            {allItems.map((item, idx) => (
              <div key={`${item.doorModel}-${item.doorType}-${item.widthMm}-${idx}`} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-secondary bg-surface-container-high mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-black text-on-surface">
                      Línea {idx + 1} — {item.familyName}
                    </div>
                    <div className="text-[10px] text-secondary mt-0.5 uppercase tracking-wide">
                      {item.childName} · {item.widthMm}x{item.heightMm} mm
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Editar puerta"
                    onClick={() => onEditDoor(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    type="button"
                    title="Eliminar puerta"
                    onClick={() => onRemoveDoor(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consultar o comenzar */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block">
          Consultar o comenzar
        </span>

        <div className="grid gap-3">
          {/* Ver detalle */}
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-left hover:bg-surface-container-high transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 bg-blue-600/10 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-base">visibility</span>
            </div>
            <div>
              <div className="text-xs font-black text-on-surface">Ver detalle del presupuesto</div>
              <div className="text-[10px] text-secondary mt-0.5">Abra una pestaña con todas las especificaciones</div>
            </div>
          </button>

          {/* Empezar de nuevo */}
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-left hover:bg-surface-container-high transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface bg-surface-container-high group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-base">delete_sweep</span>
            </div>
            <div>
              <div className="text-xs font-black text-on-surface">Empezar el presupuesto de nuevo</div>
              <div className="text-[10px] text-secondary mt-0.5">Se eliminan todas las puertas guardadas</div>
            </div>
          </button>
        </div>
      </div>

      <DetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        items={allItems}
      />
    </div>
  );
};
