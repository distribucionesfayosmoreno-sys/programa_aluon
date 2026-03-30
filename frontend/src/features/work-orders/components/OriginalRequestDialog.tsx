import AppDialog from '../../../components/feedback/AppDialog';
import type { WorkOrderRequest } from '../models';
import { WORKFLOW_STEP_LABELS } from '../constants';

export const OriginalRequestDialog = ({
  open,
  request,
  onClose,
}: {
  open: boolean;
  request: WorkOrderRequest | null;
  onClose: () => void;
}) => {
  if (!open || !request) return null;

  const line = (label: string, value: string | number | boolean | undefined | null) => (
    <div className="flex items-start justify-between gap-4 border-b py-2" style={{ borderColor: '#eef0f3' }}>
      <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#8b949e' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: '#111827', textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );

  return (
    <AppDialog
      open={open}
      title="Solicitud original"
      subtitle="Datos capturados en origen"
      tone="neutral"
      onClose={onClose}
      actions={(
        <button className="btn-ghost" onClick={onClose}>Cerrar</button>
      )}
    >
      <div className="space-y-3">
        {line('Código', request.reference || request.id)}
        {line('Fecha', request.requestDate)}
        {line('Cliente', request.customerName)}
        {line('Modelo', request.modelLabel || request.modelId)}
        {line('m²', request.m2)}
        {line('Ancho (mm)', request.widthMm)}
        {line('Alto (mm)', request.heightMm)}
        {line('Color (RAL)', request.color)}
        {line('Instalador', request.installerName)}
        {line('Google View', request.googleView ? 'Sí' : 'No')}
        {line('Estado', WORKFLOW_STEP_LABELS[request.workflowStep])}
        <div className="pt-2">
          <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#8b949e' }}>Notas</div>
          <div className="mt-2 text-sm" style={{ color: '#4b5563', whiteSpace: 'pre-wrap' }}>
            {request.notes || '—'}
          </div>
        </div>
      </div>
    </AppDialog>
  );
};
