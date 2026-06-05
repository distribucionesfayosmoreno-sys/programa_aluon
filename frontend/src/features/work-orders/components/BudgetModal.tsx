import type { BudgetData } from '../models';
import { uiColors } from './ui';
import { DocumentPopupFrame } from '../../documents/components/DocumentPopupFrame';

export const BudgetModal = ({
  open,
  onClose,
  data,
  canPrint,
  canEmail,
  onPrint,
  onEmail,
}: {
  open: boolean;
  onClose: () => void;
  data: BudgetData;
  canPrint: boolean;
  canEmail: boolean;
  onPrint: () => void;
  onEmail: () => void;
}) => {
  return (
    <DocumentPopupFrame
      open={open}
      title="Presupuesto"
      subtitle={data.budgetNumber}
      onClose={onClose}
      footer={(
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
          <button
            type="button"
            onClick={onEmail}
            className="btn-primary"
            disabled={!canEmail}
            style={{ opacity: canEmail ? 1 : 0.5, cursor: canEmail ? 'pointer' : 'not-allowed' }}
          >
            Enviar por mail
          </button>
        </div>
      )}
    >
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
    </DocumentPopupFrame>
  );
};
