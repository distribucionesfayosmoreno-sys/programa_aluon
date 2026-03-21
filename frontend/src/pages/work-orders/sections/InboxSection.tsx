import type { WorkOrderRequest } from '../models';
import { MODELS } from '../constants';
import { SectionTitle } from '../components/ui';

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
  <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <SectionTitle n="00" label="Bandeja de solicitudes (emulación)" />
    <div className="space-y-3">
      {requests.map(req => {
        const active = selectedRequestId === req.id;
        return (
          <div
            key={req.id}
            className="flex items-center justify-between gap-4 p-4 rounded-xl"
            style={{
              border: `1px solid ${active ? '#e5534b' : '#e8eaed'}`,
              background: active ? '#fff7f7' : '#f9fafb',
            }}
          >
            <div className="min-w-0">
              <div className="text-xs font-black uppercase" style={{ color: '#0d1117', letterSpacing: '0.08em' }}>
                {req.customerName}
              </div>
              <div className="text-xs mt-1" style={{ color: '#8b949e' }}>
                {req.id} · {MODELS.find(m => m.id === req.modelId)?.label} · {req.m2} m²
              </div>
              <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                Ref: {req.reference} · {req.googleView ? 'Google view' : 'Sin Google view'}
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
      <p className="text-xs mt-3" style={{ color: '#dc2626' }}>
        No se encontró el cliente en CRM. Selecciónalo manualmente en la solicitud.
      </p>
    )}
  </section>
);
