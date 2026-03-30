import React, { useCallback } from 'react';
import AppDialog from './AppDialog';

interface ErrorDialogProps {
  open: boolean;
  title: string;
  description: string;
  detail?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  title,
  description,
  detail,
  primaryLabel = 'Entendido',
  onPrimary,
  onClose,
}) => {
  const handlePrimary = useCallback(() => {
    if (onPrimary) onPrimary();
    onClose();
  }, [onPrimary, onClose]);

  const icon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" />
    </svg>
  );

  return (
    <AppDialog
      open={open}
      title={title}
      subtitle="Necesitamos tu confirmación"
      tone="danger"
      icon={icon}
      onClose={onClose}
      actions={(
        <button className="btn-primary" onClick={handlePrimary}>
          {primaryLabel}
        </button>
      )}
    >
      <div className="text-sm" style={{ color: '#4b5563', lineHeight: 1.6 }}>
        {description}
      </div>
      {detail && (
        <div
          className="mt-3 rounded-lg p-3 text-xs"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}
        >
          {detail}
        </div>
      )}
    </AppDialog>
  );
};

export default ErrorDialog;
