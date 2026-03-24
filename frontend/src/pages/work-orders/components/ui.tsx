import React from 'react';

export const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e8eaed',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
} as const;

export const uiColors = {
  accent: 'var(--accent)',
  border: '#e8eaed',
  borderLight: '#e5e7eb',
  surfaceDark: '#0d1117',
  textPrimary: '#0d1117',
  textMuted: '#6b7280',
  textSubtle: '#8b949e',
  textGhost: '#9ca3af',
  textOnDark: '#e5e7eb',
  success: '#15803d',
  danger: 'var(--danger)',
  dangerDark: 'var(--danger-dark)',
} as const;

export const SectionTitle = ({ n, label }: { n: string; label: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span style={{ fontSize: 9, fontWeight: 900, color: uiColors.accent, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
      {n} · {label}
    </span>
    <div className="flex-1 h-px" style={{ backgroundColor: uiColors.border }} />
  </div>
);

export const StatusPill = ({ label, ok }: { label: string; ok: boolean }) => (
  <span
    className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold text-center"
    style={{
      fontSize: 10,
      background: ok ? '#ecfdf3' : '#f3f4f6',
      color: ok ? uiColors.success : uiColors.textMuted,
      border: `1px solid ${ok ? '#bbf7d0' : uiColors.borderLight}`,
    }}
  >
    {label}
  </span>
);

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="field-label">{children}</label>
);

export const Field = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="field" autoComplete="off" />
);

export const TextArea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className="field" rows={4} />
);
