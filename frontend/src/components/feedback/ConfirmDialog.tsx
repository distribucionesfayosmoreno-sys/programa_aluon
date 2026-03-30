import React, { useCallback } from 'react';
import AppDialog from './AppDialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'neutral' | 'danger';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'neutral',
  loading = false,
  onConfirm,
  onClose,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const icon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.72-3L13.86 4a2 2 0 00-3.44 0L3.35 16a2 2 0 001.72 3z" />
    </svg>
  );

  const primaryStyle = tone === 'danger'
    ? { backgroundColor: 'var(--danger)', boxShadow: '0 4px 12px -2px rgba(220,38,38,0.45)' }
    : undefined;

  return (
    <AppDialog
      open={open}
      title={title}
      subtitle={tone === 'danger' ? 'Acción irreversible' : 'Revisa antes de continuar'}
      tone={tone}
      icon={icon}
      onClose={onClose}
      actions={(
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={loading}
            style={primaryStyle}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </>
      )}
    >
      <div className="text-sm" style={{ color: '#4b5563', lineHeight: 1.6 }}>
        {description}
      </div>
      {tone === 'danger' && (
        <div className="mt-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--danger-text)' }}>
          Esta acción se registra en el historial.
        </div>
      )}
    </AppDialog>
  );
};

export default ConfirmDialog;
