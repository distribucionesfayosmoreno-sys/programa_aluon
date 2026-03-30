import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AppDialog from './AppDialog';

interface AuthorizationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: (authorizerUserId: string) => void;
  onClose: () => void;
}

const AuthorizationDialog: React.FC<AuthorizationDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Autorizar y continuar',
  onConfirm,
  onClose,
}) => {
  const [authorizerId, setAuthorizerId] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAuthorizerId('');
    setTouched(false);
  }, [open]);

  const isValid = useMemo(() => /^\d+$/.test(authorizerId.trim()), [authorizerId]);

  const handleConfirm = useCallback(() => {
    setTouched(true);
    if (!isValid) return;
    onConfirm(authorizerId.trim());
  }, [authorizerId, isValid, onConfirm]);

  return (
    <AppDialog
      open={open}
      title={title}
      subtitle="Autorización requerida"
      tone="warning"
      icon={(
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-2.21-1.79-4-4-4s-4 1.79-4 4v4h8v-4zm0 0a4 4 0 014-4h1a4 4 0 014 4v4H12v-4z" />
        </svg>
      )}
      onClose={onClose}
      actions={(
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </>
      )}
    >
      <div className="text-sm" style={{ color: '#4b5563', lineHeight: 1.6 }}>
        {description}
      </div>
      <div className="mt-5">
        <label className="field-label">ID del autorizador (ADMIN/DIOS)</label>
        <input
          className="field"
          value={authorizerId}
          onChange={event => setAuthorizerId(event.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="ID numérico"
          inputMode="numeric"
        />
        {touched && !isValid && (
          <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--danger)' }}>
            Introduce un ID numérico válido.
          </div>
        )}
      </div>
    </AppDialog>
  );
};

export default AuthorizationDialog;
