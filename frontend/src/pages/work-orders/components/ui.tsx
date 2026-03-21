import React from 'react';

export const SectionTitle = ({ n, label }: { n: string; label: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span style={{ fontSize: 9, fontWeight: 900, color: '#e5534b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
      {n} · {label}
    </span>
    <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaed' }} />
  </div>
);

export const StatusPill = ({ label, ok }: { label: string; ok: boolean }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
    style={{
      fontSize: 10,
      background: ok ? '#ecfdf3' : '#f3f4f6',
      color: ok ? '#15803d' : '#6b7280',
      border: `1px solid ${ok ? '#bbf7d0' : '#e5e7eb'}`,
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
