import { createPortal } from 'react-dom';
import type { WorkOrderData } from '../models';
import { uiColors } from './ui';

export const WorkOrderModal = ({
  open,
  onClose,
  data,
  canPrint,
  onPrint,
}: {
  open: boolean;
  onClose: () => void;
  data: WorkOrderData;
  canPrint: boolean;
  onPrint: () => void;
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
              style={{ background: 'rgba(229,83,75,0.15)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: uiColors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h9M9 12h9M9 18h9M5 6h.01M5 12h.01M5 18h.01" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Orden de trabajo
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: uiColors.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {data.workOrderNumber}
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

        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-5" style={{ border: `1px solid ${uiColors.border}`, background: '#f9fafb' }}>
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
                Cliente
              </div>
              <div className="mt-2 text-sm font-bold">{data.customerName}</div>
              <div className="text-xs" style={{ color: uiColors.textMuted }}>{data.customerAddress || '—'}</div>
              <div className="text-xs" style={{ color: uiColors.textMuted }}>Telf. {data.customerPhone || '—'}</div>
              <div className="mt-3 text-xs font-bold uppercase" style={{ color: '#111827' }}>
                {data.workOrderDate}
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ border: `1px solid ${uiColors.border}`, background: '#ffffff' }}>
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
                Pieza / Modelo
              </div>
              <div className="mt-2 text-sm font-bold">{data.modelLabel}</div>
              <div className="text-xs" style={{ color: uiColors.textMuted }}>Referencia: {data.modelReference || '—'}</div>
              <div className="text-xs" style={{ color: uiColors.textMuted }}>{data.doorModelLabel} · {data.doorTypeLabel}</div>
              <div className="text-xs" style={{ color: uiColors.textMuted }}>{data.widthMm} × {data.heightMm} mm</div>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ border: `1px solid ${uiColors.border}`, background: '#ffffff' }}>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
              Datos de despiece
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs" style={{ color: uiColors.textMuted }}>
              <div>Distribuidor: {data.distributor || '—'}</div>
              <div>Nº Presupuesto: {data.budgetNumber || '—'}</div>
              <div>Fecha: {data.budgetDate || '—'}</div>
              <div>Color: {data.color || '—'}</div>
              <div>Instalador: {data.installerName || '—'}</div>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ border: `1px solid ${uiColors.border}`, background: '#ffffff' }}>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
              Parámetros técnicos
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs" style={{ color: uiColors.textMuted }}>
              <div>Holgura suelo: {data.groundClearanceMm ?? '—'} mm</div>
              <div>Larguero: {data.largueroMm ?? '—'} mm</div>
              <div>Marco superior: {data.topFrame ? 'Sí' : 'No'}</div>
              <div>Bisagras: {data.hingesSide === 'LEFT' ? 'Izquierda' : data.hingesSide === 'RIGHT' ? 'Derecha' : '—'}</div>
              <div>Portero automático: {data.porterAutomatic ? 'Sí' : 'No'}</div>
              <div>Automatización: {data.automationIncluded ? 'Sí' : 'No'}</div>
              <div>Refuerzo automatización: {data.automationReinforcement ? 'Sí' : 'No'}</div>
              <div>Primera hoja: {data.openingSide === 'LEFT' ? 'Izquierda' : data.openingSide === 'RIGHT' ? 'Derecha' : '—'}</div>
              <div>Altura izquierda: {data.heightLeftMm ?? '—'} mm</div>
              <div>Altura derecha: {data.heightRightMm ?? '—'} mm</div>
              <div>Anchura izquierda: {data.widthLeftMm ?? '—'} mm</div>
              <div>Anchura derecha: {data.widthRightMm ?? '—'} mm</div>
              <div>Carril: {data.railType ?? '—'}</div>
              <div>Montaje: {data.mountingType ?? '—'}</div>
              <div>Cola: {data.tail ? 'Sí' : 'No'}</div>
            </div>
            {data.notes && (
              <div className="mt-3 text-xs" style={{ color: uiColors.textMuted }}>
                Notas: {data.notes}
              </div>
            )}
          </div>

          <div className="rounded-xl p-5" style={{ border: `1px solid ${uiColors.border}`, background: '#ffffff' }}>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textSubtle }}>
              Despiece
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', color: uiColors.textMuted }}>
                    <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Descripción</th>
                    <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Unidades</th>
                    <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Medida corte</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, idx) => (
                    <tr key={`${data.workOrderNumber}-${idx}`}>
                      <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>{item.description}</td>
                      <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>{item.units}x</td>
                      <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>{item.cutMeasure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: `1px solid ${uiColors.border}`, background: '#f8f9fb' }}
        >
          <p style={{ fontSize: 10, color: uiColors.textSubtle, fontWeight: 600 }} className="hidden sm:block">
            Confirmación requerida para impresión
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="btn-ghost">Cerrar</button>
            <button
              type="button"
              onClick={onPrint}
              className="btn-primary"
              disabled={!canPrint}
              style={{ opacity: canPrint ? 1 : 0.5, cursor: canPrint ? 'pointer' : 'not-allowed' }}
            >
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};
