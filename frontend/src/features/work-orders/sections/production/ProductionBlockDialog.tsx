import { useState } from 'react';
import type { ProductionStationCode } from './ProductionStation.types';
import { uiColors } from '../../components/ui';
import AppDialog from '../../../../components/feedback/AppDialog';

type ProductionBlockDialogProps = {
  open: boolean;
  stationCode: ProductionStationCode | null;
  stationLabel: string;
  onConfirm: (stationCode: ProductionStationCode, reason: string) => void;
  onClose: () => void;
};

/**
 * Modal para registrar el motivo de bloqueo de una estación.
 */
export const ProductionBlockDialog = ({
  open,
  stationCode,
  stationLabel,
  onConfirm,
  onClose,
}: ProductionBlockDialogProps) => {
  const [reason, setReason] = useState('');

  if (!open || !stationCode) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(stationCode, reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <AppDialog
      open={open}
      title="Bloquear estación"
      subtitle={`Bloqueo de: ${stationLabel}`}
      tone="danger"
      icon={<span className="text-xl leading-none">🚫</span>}
      onClose={handleClose}
      maxWidthClassName="max-w-md"
      actions={
        <>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg"
            style={{ color: uiColors.textSubtle, background: '#f3f4f6' }}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg"
            style={{
              color: '#fff',
              background: reason.trim() ? '#ef4444' : '#fca5a5',
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
            }}
            disabled={!reason.trim()}
            onClick={handleSubmit}
          >
            Confirmar bloqueo
          </button>
        </>
      }
    >
      <p className="text-xs mb-4" style={{ color: uiColors.textSubtle }}>
        Indica el motivo por el que se bloquea la estación <strong>{stationLabel}</strong>.
        Esta acción detendrá la cadena de montaje hasta que se resuelva.
      </p>

      <textarea
        className="field w-full"
        rows={3}
        placeholder="Describe la incidencia..."
        value={reason}
        onChange={e => setReason(e.target.value)}
        autoFocus
        style={{ resize: 'vertical' }}
      />
    </AppDialog>
  );
};
