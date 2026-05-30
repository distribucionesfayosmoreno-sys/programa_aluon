import type { PropsWithChildren, ReactNode } from 'react';
import { dashboardTheme } from '../dashboardTheme';

type Props = PropsWithChildren<{
  title: ReactNode;
  accentColor: string;
  right?: ReactNode;
  className?: string;
}>;

export const DashboardCard = ({ title, accentColor, right, className, children }: Props) => {
  return (
    <section
      className={[
        'relative rounded-[18px] border bg-white',
        'shadow-[0_18px_40px_rgba(16,24,40,0.08)]',
        'overflow-hidden',
        className ?? '',
      ].join(' ')}
      style={{ borderColor: dashboardTheme.border }}
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
          <h2 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
            {title}
          </h2>
        </div>
        {right}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
};
