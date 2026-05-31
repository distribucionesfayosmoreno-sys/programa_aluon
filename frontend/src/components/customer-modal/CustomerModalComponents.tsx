import React from 'react';

export const FL = ({ children }: { children: React.ReactNode }) => (
  <label className="field-label">{children}</label>
);

export const FI = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="field" autoComplete="off" />
);

export type ValidationStatus = 'neutral' | 'error' | 'ok';

interface ValidationHintProps {
  status: ValidationStatus;
  hint: string;
}

export const ValidationHint = ({ status, hint }: ValidationHintProps) => (
  <div
    className="validation-hint mt-0.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
    style={{
      color:
        status === 'error'
          ? 'var(--danger, #ef4444)'
          : status === 'ok'
            ? 'var(--success, #16a34a)'
            : '#9ca3af',
    }}
  >
    {status === 'error' && (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    {status === 'ok' && (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )}
    <span>{hint}</span>
  </div>
);

export const SectionTitle = ({ n, label }: { n: string; label: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span style={{ fontSize: 9, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
      {n} · {label}
    </span>
    <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaed' }} />
  </div>
);
