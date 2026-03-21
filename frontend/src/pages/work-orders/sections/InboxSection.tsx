import type { WorkOrderRequest } from '../models';
import { MODELS, WORKFLOW_STEP_LABELS } from '../constants';
import { cardStyle, SectionTitle, uiColors } from '../components/ui';

export const InboxSection = ({
  requests,
  selectedRequestId,
  customerId,
  onApplyRequest,
}: {
  requests: WorkOrderRequest[];
  selectedRequestId: string | null;
  customerId: string;
  onApplyRequest: (req: WorkOrderRequest) => void;
}) => (
  <section className="p-6 rounded-2xl" style={cardStyle}>
    <SectionTitle n="00" label="Bandeja de solicitudes (emulación)" />
    <div className="space-y-3">
      {requests.map(req => {
        const active = selectedRequestId === req.id;
        return (
          <div
            key={req.id}
            className="flex items-center justify-between gap-4 p-4 rounded-xl"
            style={{
              border: `1px solid ${active ? uiColors.accent : uiColors.border}`,
              background: active ? '#fff7f7' : '#f9fafb',
            }}
          >
            <div className="min-w-0">
              <div className="text-xs font-black uppercase" style={{ color: uiColors.textPrimary, letterSpacing: '0.08em' }}>
                {req.customerName}
              </div>
              <div className="text-xs mt-1" style={{ color: uiColors.textSubtle }}>
                {req.id} · {MODELS.find(m => m.id === req.modelId)?.label} · {req.m2} m²
              </div>
              <div className="text-xs mt-1" style={{ color: uiColors.textGhost }}>
                Ref: {req.reference} · {req.googleView ? 'Google view' : 'Sin Google view'}
              </div>
              <div className="text-xs mt-2 flex items-center gap-2" style={{ color: uiColors.textMuted }}>
                <span className="font-semibold">Estado</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                  style={{ background: '#fff1f0', color: uiColors.accent }}
                >
                  {WORKFLOW_STEP_LABELS[req.workflowStep]}
                </span>
              </div>
            </div>
            <button type="button" className="btn-ghost" onClick={() => onApplyRequest(req)}>
              Cargar solicitud
            </button>
          </div>
        );
      })}
    </div>
    {selectedRequestId && !customerId && (
      <p className="text-xs mt-3" style={{ color: uiColors.danger }}>
        No se encontró el cliente en CRM. Selecciónalo manualmente en la solicitud.
      </p>
    )}
  </section>
);
