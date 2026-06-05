import type { WorkOrderData } from '../models';
import { DocumentPopupFrame } from '../../documents/components/DocumentPopupFrame';
import {
  DocumentInfoLine,
  DocumentSectionCard,
  DocumentStatCard,
  documentSurfaceGradient,
} from '../../documents/components/documentPopupPrimitives';
import { dashboardTheme } from '../../dashboard/dashboardTheme';

type WorkOrderModalProps = {
  open: boolean;
  onClose: () => void;
  data: WorkOrderData;
  canPrint: boolean;
  onPrint: () => void;
};

export const WorkOrderModal = ({
  open,
  onClose,
  data,
  canPrint,
  onPrint,
}: WorkOrderModalProps) => {
  return (
    <DocumentPopupFrame
      open={open}
      title="Orden de trabajo"
      subtitle={data.workOrderNumber}
      onClose={onClose}
      footer={(
        <div className="flex items-center gap-3 ml-auto">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cerrar
          </button>
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
      )}
    >
      <div className="rounded-[22px] border p-6" style={{ ...documentSurfaceGradient, borderColor: dashboardTheme.border }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DocumentStatCard label="Cliente" value={data.customerName} hint={data.customerPhone || 'Sin teléfono'} />
          <DocumentStatCard label="Modelo" value={data.modelLabel} hint={data.doorModelLabel} />
          <DocumentStatCard label="Referencia" value={data.modelReference || '—'} hint={data.workOrderDate} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <DocumentSectionCard
            title="Datos generales"
            subtitle="Información comercial y contexto del documento"
            tone="income"
          >
            <div className="space-y-3">
              <DocumentInfoLine label="Cliente" value={data.customerName} />
              <DocumentInfoLine label="Dirección" value={data.customerAddress || '—'} />
              <DocumentInfoLine label="Teléfono" value={data.customerPhone || '—'} />
              <DocumentInfoLine label="Fecha" value={data.workOrderDate} />
              <DocumentInfoLine label="Modelo / tipo" value={`${data.doorModelLabel} · ${data.doorTypeLabel}`} />
              <DocumentInfoLine label="Dimensiones" value={`${data.widthMm} × ${data.heightMm} mm`} />
            </div>
          </DocumentSectionCard>

          <DocumentSectionCard
            title="Pieza y despiece"
            subtitle="Resumen técnico previo a producción"
            tone="transactions"
          >
            <div className="space-y-3">
              <DocumentInfoLine label="Distribuidor" value={data.distributor || '—'} />
              <DocumentInfoLine label="Nº presupuesto" value={data.budgetNumber || '—'} />
              <DocumentInfoLine label="Fecha presupuesto" value={data.budgetDate || '—'} />
              <DocumentInfoLine label="Color" value={data.color || '—'} />
              <DocumentInfoLine label="Instalador" value={data.installerName || '—'} />
              {data.notes ? <DocumentInfoLine label="Notas" value={data.notes} /> : null}
            </div>
          </DocumentSectionCard>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.95fr]">
          <DocumentSectionCard
            title="Parámetros técnicos"
            subtitle="Valores que alimentan el corte y fabricación"
            tone="issues"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DocumentInfoLine label="Holgura suelo" value={`${data.groundClearanceMm ?? '—'} mm`} />
              <DocumentInfoLine label="Larguero" value={`${data.largueroMm ?? '—'} mm`} />
              <DocumentInfoLine label="Marco superior" value={data.topFrame ? 'Sí' : 'No'} />
              <DocumentInfoLine label="Bisagras" value={data.hingesSide === 'LEFT' ? 'Izquierda' : data.hingesSide === 'RIGHT' ? 'Derecha' : '—'} />
              <DocumentInfoLine label="Portero automático" value={data.porterAutomatic ? 'Sí' : 'No'} />
              <DocumentInfoLine label="Automatización" value={data.automationIncluded ? 'Sí' : 'No'} />
              <DocumentInfoLine label="Refuerzo automatización" value={data.automationReinforcement ? 'Sí' : 'No'} />
              <DocumentInfoLine label="Primera hoja" value={data.openingSide === 'LEFT' ? 'Izquierda' : data.openingSide === 'RIGHT' ? 'Derecha' : '—'} />
              <DocumentInfoLine label="Altura izquierda" value={`${data.heightLeftMm ?? '—'} mm`} />
              <DocumentInfoLine label="Altura derecha" value={`${data.heightRightMm ?? '—'} mm`} />
              <DocumentInfoLine label="Anchura izquierda" value={`${data.widthLeftMm ?? '—'} mm`} />
              <DocumentInfoLine label="Anchura derecha" value={`${data.widthRightMm ?? '—'} mm`} />
              <DocumentInfoLine label="Carril" value={data.railType ?? '—'} />
              <DocumentInfoLine label="Montaje" value={data.mountingType ?? '—'} />
              <DocumentInfoLine label="Cola" value={data.tail ? 'Sí' : 'No'} />
            </div>
          </DocumentSectionCard>

          <DocumentSectionCard
            title="Despiece"
            subtitle="Listado de cortes y cantidades"
            tone="histogram"
          >
            <div className="overflow-x-auto rounded-[16px] border" style={{ borderColor: dashboardTheme.border }}>
              <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                <thead style={{ background: dashboardTheme.surfaceSoft }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                      Unidades
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
                      Medida corte
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, idx) => (
                    <tr key={`${data.workOrderNumber}-${idx}`} style={{ borderTop: `1px solid ${dashboardTheme.border}` }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: dashboardTheme.text }}>
                        {item.description}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: dashboardTheme.text }}>
                        {item.units}x
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: dashboardTheme.text }}>
                        {item.cutMeasure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocumentSectionCard>
        </div>
      </div>
    </DocumentPopupFrame>
  );
};
