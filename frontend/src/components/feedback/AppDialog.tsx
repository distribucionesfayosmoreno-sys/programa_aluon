import React, { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

type DialogTone = 'neutral' | 'danger' | 'success' | 'warning';

interface AppDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  tone?: DialogTone;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
  maxWidthClassName?: string;
}

const toneStyles: Record<DialogTone, { header: string; accent: string; iconBg: string }> = {
  neutral: { header: '#0d1117', accent: 'var(--accent)', iconBg: 'var(--accent-shadow-light)' },
  danger: { header: '#190b0b', accent: 'var(--danger)', iconBg: 'var(--danger-bg)' },
  success: { header: '#0b1711', accent: '#16a34a', iconBg: '#dcfce7' },
  warning: { header: '#1f1305', accent: '#d97706', iconBg: '#fef3c7' },
};

const AppDialog: React.FC<AppDialogProps> = ({
  open,
  title,
  subtitle,
  tone = 'neutral',
  icon,
  actions,
  onClose,
  children,
  maxWidthClassName = 'max-w-xl',
}) => {
  const styles = toneStyles[tone];

  const handleBackdrop = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return document.getElementById('main-layout') ?? document.body;
  }, []);

  if (!open) return null;

  const content = (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={handleBackdrop} />
      <div
        className={`relative w-full ${maxWidthClassName} rounded-2xl flex flex-col overflow-hidden animate-fade-up`}
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: styles.header, borderBottom: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-3.5">
            {icon && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: styles.iconBg, color: styles.accent }}
              >
                {icon}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: '#8b949e' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-7">
          {children}
        </div>
        {actions && (
          <div className="px-7 py-5 flex items-center justify-end gap-2" style={{ borderTop: '1px solid #e8eaed', background: '#f9fafb' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};

export type { DialogTone };
export default AppDialog;
