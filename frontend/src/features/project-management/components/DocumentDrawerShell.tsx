import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export const DocumentDrawerShell = ({ open, title, subtitle, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15, 23, 42, 0.45)' }}
        onClick={onClose}
      />

      <aside
        className="absolute right-0 top-0 h-full w-[50vw] min-w-[620px] max-w-[820px] bg-white shadow-2xl flex flex-col"
        style={{
          transform: 'translateX(0)',
          transition: 'transform 220ms ease',
          borderLeft: '1px solid #e5e7eb',
        }}
        aria-label="Detalle del documento"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="min-w-0">
            <div className="text-sm font-black truncate" style={{ color: '#0f172a' }}>{title}</div>
            {subtitle ? (
              <div className="text-xs font-semibold mt-1 truncate" style={{ color: '#64748b' }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: '#64748b' }}
            onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
            aria-label="Cerrar"
            title="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
};

