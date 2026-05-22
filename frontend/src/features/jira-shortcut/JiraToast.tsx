import type { FC } from 'react';
import type { JiraToastProps } from './JiraToast.types';

export const JiraToast: FC<JiraToastProps> = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div
        className="rounded-2xl px-4 py-3 shadow-md border flex items-start gap-3"
        style={{ backgroundColor: '#ecfdf5', borderColor: '#bbf7d0', color: '#065f46', minWidth: 260, maxWidth: 360 }}
        role="status"
        aria-live="polite"
      >
        <div className="text-lg leading-none" aria-hidden="true">✅</div>
        <div className="text-sm leading-5 flex-1">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: '#047857' }}
          aria-label="Cerrar notificación"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

