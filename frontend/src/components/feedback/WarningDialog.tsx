import React, { useCallback } from 'react';
import AppDialog from './AppDialog';

interface WarningDialogProps {
  open: boolean;
  title: string;
  description: string;
  items?: string[];
  detail?: string;
  cancelLabel?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose: () => void;
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  open,
  title,
  description,
  items,
  detail,
  cancelLabel = 'Cerrar',
  primaryLabel = 'Revisar',
  onPrimary,
  onClose,
}) => {
  const handlePrimary = useCallback(() => {
    if (onPrimary) onPrimary();
    onClose();
  }, [onPrimary, onClose]);

  return (
    <AppDialog
      open={open}
      title={title}
      tone="neutral"
      onClose={onClose}
      headerVariant="none"
      maxWidthClassName="max-w-2xl"
      actions={(
        <div className="flex items-center justify-center gap-3 w-full">
          <button className="btn-primary" onClick={handlePrimary} style={{ backgroundColor: '#e11d48' }}>
            {primaryLabel}
          </button>
          <button className="btn-ghost" onClick={onClose} style={{ opacity: 0.9 }}>
            {cancelLabel}
          </button>
        </div>
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86l-8.11 14.05A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.32-2.09L13.71 3.86a1.5 1.5 0 00-2.6 0z" />
          </svg>
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-rose-600">
          {title}
        </h2>
      </div>

      <div className="mt-8 -mx-7 px-10 py-8 bg-slate-50 border-t border-slate-200">
        <div className="text-base font-semibold text-slate-700">{description}</div>
        {items && items.length > 0 ? (
          <div className="mt-5 space-y-3">
            {items.map(item => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded border border-rose-300 bg-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-sm text-slate-500 leading-relaxed">{item}</div>
              </div>
            ))}
          </div>
        ) : null}
        {detail ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600">
            {detail}
          </div>
        ) : null}
      </div>
    </AppDialog>
  );
};

export default WarningDialog;
