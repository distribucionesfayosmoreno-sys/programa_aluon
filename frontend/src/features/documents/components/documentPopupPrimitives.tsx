import type { ReactNode } from 'react';
import { dashboardTheme } from '../../dashboard/dashboardTheme';

type SectionTone = keyof typeof dashboardTheme.accentBars;

type DocumentSectionCardProps = {
  title: string;
  subtitle?: string;
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
};

type DocumentStatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

type DocumentInfoLineProps = {
  label: string;
  value?: string | null;
};

const sectionCardBaseClass = 'rounded-[18px] border bg-white shadow-[0_18px_40px_rgba(16,24,40,0.08)]';

export const DocumentSectionCard = ({
  title,
  subtitle,
  tone = 'transactions',
  children,
  className = '',
}: DocumentSectionCardProps) => (
  <section className={`${sectionCardBaseClass} ${className}`.trim()}>
    <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: dashboardTheme.accentBars[tone] }} aria-hidden="true" />
          <h3 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
            {title}
          </h3>
        </div>
        {subtitle ? (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: dashboardTheme.muted }}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
    <div className="px-5 pb-5">
      {children}
    </div>
  </section>
);

export const DocumentStatCard = ({ label, value, hint }: DocumentStatCardProps) => (
  <div className="rounded-[16px] border bg-white px-4 py-4" style={{ borderColor: dashboardTheme.border, boxShadow: dashboardTheme.shadowSoft }}>
    <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: dashboardTheme.muted }}>
      {label}
    </div>
    <div className="mt-2 text-[14px] font-black tracking-tight" style={{ color: dashboardTheme.text }}>
      {value}
    </div>
    {hint ? (
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: dashboardTheme.muted }}>
        {hint}
      </div>
    ) : null}
  </div>
);

export const DocumentInfoLine = ({ label, value }: DocumentInfoLineProps) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: dashboardTheme.muted }}>
      {label}
    </span>
    <span className="text-right font-medium" style={{ color: dashboardTheme.text }}>
      {value || '—'}
    </span>
  </div>
);

export const documentSurfaceGradient = {
  background: `linear-gradient(180deg, ${dashboardTheme.surfaceSoft} 0%, ${dashboardTheme.surface} 34%)`,
} as const;
