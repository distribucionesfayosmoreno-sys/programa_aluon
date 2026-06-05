import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { uiColors } from '../../work-orders/components/ui';

type DocumentPopupFrameProps = {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionDisabled?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionDisabled?: boolean;
};

export const DocumentPopupFrame = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionDisabled,
}: DocumentPopupFrameProps) => {
  if (!open) return null;

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('main-layout') : null;

  const content = (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: uiColors.surfaceDark, borderBottom: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-shadow-light)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: uiColors.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6v2m0 16v2m8-10h2M2 12H4m12.95-6.95l1.41 1.41M5.64 18.36l1.41-1.41m0-10.3L5.64 5.64m12.72 12.72-1.41-1.41" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: uiColors.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: uiColors.textSubtle }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = uiColors.textSubtle; }}
            aria-label="Cerrar"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {children}
        </div>

        {(footer || primaryActionLabel || secondaryActionLabel) ? (
          <div
            className="flex items-center justify-between gap-4 px-7 py-5"
            style={{ borderTop: `1px solid ${uiColors.border}`, background: '#f8f9fb' }}
          >
            {footer ? footer : <div />}
            {!footer && (primaryActionLabel || secondaryActionLabel) ? (
              <div className="flex items-center gap-3 ml-auto">
                {secondaryActionLabel && onSecondaryAction ? (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="btn-ghost"
                    disabled={secondaryActionDisabled}
                  >
                    {secondaryActionLabel}
                  </button>
                ) : null}
                {primaryActionLabel && onPrimaryAction ? (
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="btn-primary"
                    disabled={primaryActionDisabled}
                    style={{ opacity: primaryActionDisabled ? 0.5 : 1, cursor: primaryActionDisabled ? 'not-allowed' : 'pointer' }}
                  >
                    {primaryActionLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};
