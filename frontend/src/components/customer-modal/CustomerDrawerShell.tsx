import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthPx?: number;
};

export const CustomerDrawerShell = ({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidthPx = 720,
}: Props) => {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="absolute inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background: 'rgba(17,24,39,0.55)',
          backdropFilter: 'blur(6px)',
          opacity: entered ? 1 : 0,
          transition: 'opacity 220ms ease-out',
        }}
      />

      <div
        className="customer-drawer absolute right-0 top-0 h-full w-full flex flex-col overflow-hidden"
        style={{
          background: '#ffffff',
          width: '50vw',
          maxWidth: maxWidthPx,
          borderLeft: '1px solid #e5e7eb',
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          boxShadow: '-18px 0 50px rgba(15,23,42,0.16)',
          transform: entered ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <style>{`
          .customer-drawer .field {
            font-size: 0.75rem;
            padding: 0.45rem 0.75rem;
          }
          .customer-drawer .field-label {
            font-size: 8px;
            margin-bottom: 0.3rem;
          }
          .customer-drawer .validation-hint {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 0;
            text-transform: none;
          }
          .customer-drawer .validation-hint span {
            font-size: inherit;
          }
        `}</style>
        <div
          className="flex items-start justify-between px-6 py-4"
          style={{ background: '#ffffff', borderBottom: '1px solid #eef2f7' }}
        >
          <div className="min-w-0">
            <div className="text-[20px] font-semibold truncate" style={{ color: '#0f172a' }}>
              {title}
            </div>
            {subtitle ? (
              <div className="text-[9px] font-medium mt-0.5 truncate" style={{ color: '#64748b' }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ border: '1px solid #eef2f7', background: '#ffffff', color: '#64748b' }}
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="px-6 py-4" style={{ borderTop: '1px solid #eef2f7', background: '#ffffff' }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
