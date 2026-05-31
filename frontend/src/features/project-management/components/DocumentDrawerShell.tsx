import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  headerBg?: string;
  onClose: () => void;
  children: ReactNode;
};

export const DocumentDrawerShell = ({ open, title, subtitle, headerBg, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15, 23, 42, 0.45)' }}
      />

      <aside
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ border: '1px solid #e5e7eb' }}
        aria-label="Detalle del documento"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-4 px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', background: headerBg ?? '#0f172a', color: '#ffffff' }}
        >
          <div className="min-w-0">
            <div className="text-sm font-black truncate">{title}</div>
            {subtitle ? (
              <div className="text-xs font-semibold mt-1 truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-white/90 hover:text-white"
            onClick={onClose}
            aria-label="Cerrar"
            title="Cerrar"
          >
            <span className="text-2xl leading-none font-black">×</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50">
          {children}
        </div>
      </aside>
    </div>
  );
};
