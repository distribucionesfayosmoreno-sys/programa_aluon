import { createPortal } from 'react-dom';
import type { BudgetData } from '../models';
import { uiColors } from './ui';

export const BudgetModal = ({
  open,
  onClose,
  data,
  canExport,
  onPrint,
  onEmail,
}: {
  open: boolean;
  onClose: () => void;
  data: BudgetData;
  canExport: boolean;
  onPrint: () => void;
  onEmail: () => void;
}) => {
  if (!open) return null;

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('main-layout') : null;

  const content = (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: uiColors.surfaceDark, borderBottom: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-shadow-light)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: uiColors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6v2m0 16v2m8-10h2M2 12H4m12.95-6.95l1.41 1.41M5.64 18.36l1.41-1.41m0-10.3L5.64 5.64m12.72 12.72-1.41-1.41" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Presupuesto
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: uiColors.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {data.budgetNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: uiColors.textSubtle }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = uiColors.textSubtle; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="rounded-xl p-6" style={{ border: `1px solid ${uiColors.border}`, background: '#ffffff' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <div className="text-lg font-black tracking-widest" style={{ color: '#111827' }}>ALUON</div>
                <div className="text-xs font-bold uppercase mt-1" style={{ color: uiColors.textMuted, letterSpacing: '0.08em' }}>
                  ALUMINIO SOLDADO, S.L.
                </div>
                <div className="mt-2 flex justify-center md:justify-start">
                  <div className="h-px w-20" style={{ background: uiColors.textGhost }} />
                </div>
                <div className="mt-3 text-xs font-semibold uppercase leading-5" style={{ color: uiColors.textMuted, letterSpacing: '0.04em' }}>
                  Telf. 925 55 40 14
                  <br />
                  Ctra. 4004 Km. 29,200
                  <br />
                  45290 Pantoja (Toledo)
                  <br />
                  info@aluon.es
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 text-[11px] font-semibold uppercase" style={{ color: uiColors.textMuted, letterSpacing: '0.06em' }}>
                  <div>18 de</div>
                  <div>Marzo</div>
                  <div>de 2026</div>
                </div>
                <div className="mt-2 text-[11px] font-black uppercase" style={{ color: '#111827', letterSpacing: '0.08em' }}>
                  Presupuesto Nº {data.budgetNumber}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="w-56 h-20 flex items-center justify-center" style={{ background: '#111827', color: '#fff' }}>
                  <div className="text-center">
                    <div className="text-xl font-black" style={{ letterSpacing: '0.3em' }}>ALUON</div>
                    <div className="text-[11px]" style={{ color: '#cbd5f5' }}>Somos Aluminio Soldado</div>
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold uppercase" style={{ color: uiColors.textMuted, letterSpacing: '0.04em' }}>
                  {data.customerName}
                </div>
                <div className="text-xs uppercase" style={{ color: uiColors.textMuted }}>{data.customerAddress || '—'}</div>
                <div className="text-xs uppercase" style={{ color: uiColors.textMuted }}>Toledo</div>
                <div className="text-xs uppercase" style={{ color: uiColors.textMuted }}>Telf. {data.customerPhone}</div>
                <div className="text-xs uppercase" style={{ color: uiColors.textMuted }}>E-mail {data.customerEmail || '—'}</div>
              </div>
            </div>

            <div className="mt-5 border rounded-lg overflow-hidden" style={{ borderColor: uiColors.borderLight }}>
              <div className="grid grid-cols-12 text-xs font-bold" style={{ background: '#f9fafb', color: uiColors.textMuted }}>
                <div className="col-span-2 px-3 py-2">Cantidad</div>
                <div className="col-span-7 px-3 py-2">Descripción</div>
                <div className="col-span-1 px-3 py-2 text-right">Precio Ud.</div>
                <div className="col-span-2 px-3 py-2 text-right">Total</div>
              </div>
              <div className="grid grid-cols-12 text-xs" style={{ borderTop: `1px solid ${uiColors.borderLight}` }}>
                <div className="col-span-2 px-3 py-3">{data.m2.toFixed(2)}</div>
                <div className="col-span-7 px-3 py-3">
                  <div className="font-semibold">{data.modelLabel}</div>
                  <div style={{ color: uiColors.textMuted }}>Referencia: {data.reference || '—'}</div>
                  <div style={{ color: uiColors.textMuted }}>m²: {data.m2.toFixed(2)}</div>
                  {data.notes && <div style={{ color: uiColors.textMuted }}>Notas: {data.notes}</div>}
                </div>
                <div className="col-span-1 px-3 py-3 text-right">{data.pricePerM2.toFixed(2)}</div>
                <div className="col-span-2 px-3 py-3 text-right font-semibold">{data.total.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-6 text-xs" style={{ color: uiColors.textMuted }}>
              <div className="font-bold uppercase" style={{ color: '#111827' }}>Condiciones generales</div>
              <div className="mt-1">Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.</div>
              <div>Validez del presupuesto: 15 días.</div>
              <div>Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 text-xs" style={{ color: uiColors.textMuted }}>
              <div className="text-center">
                <div className="h-px mb-2" style={{ background: uiColors.borderLight }} />
                Conforme el cliente
              </div>
              <div className="text-center">
                <div className="h-px mb-2" style={{ background: uiColors.borderLight }} />
                Conforme la empresa
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: `1px solid ${uiColors.border}`, background: '#f8f9fb' }}
        >
          <p style={{ fontSize: 10, color: uiColors.textSubtle, fontWeight: 600 }} className="hidden sm:block">
            Confirmación requerida para impresión o envío
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="btn-ghost">Cerrar</button>
            <button
              type="button"
              onClick={onPrint}
              className="btn-primary"
              disabled={!canExport}
              style={{ opacity: canExport ? 1 : 0.5, cursor: canExport ? 'pointer' : 'not-allowed' }}
            >
              Imprimir
            </button>
            <button
              type="button"
              onClick={onEmail}
              className="btn-primary"
              disabled={!canExport}
              style={{ opacity: canExport ? 1 : 0.5, cursor: canExport ? 'pointer' : 'not-allowed' }}
            >
              Enviar por mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};
