import type { DashboardBreakdownItem } from '../Dashboard.types';
import { dashboardTheme } from '../dashboardTheme';
import { DashboardIcons } from './icons/dashboardIcons';

type Props = {
  title: string;
  accentColor: string;
  items: DashboardBreakdownItem[];
  formatCurrency: (value: number) => string;
};

const iconBg = (color: string) => {
  const alpha = '1a'; // ~10%
  const rgb = color.startsWith('#') ? color.slice(1) : '';
  return rgb.length === 6 ? `#${rgb}${alpha}` : 'rgba(16,24,40,0.06)';
};

export const OverviewList = ({ title, accentColor, items, formatCurrency }: Props) => {
  return (
    <section
      className="rounded-[18px] border bg-white overflow-hidden shadow-[0_18px_40px_rgba(16,24,40,0.08)]"
      style={{ borderColor: dashboardTheme.border }}
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
          <h3 className="text-[13px] font-semibold" style={{ color: dashboardTheme.text }}>
            {title}
          </h3>
        </div>
        <button type="button" className="text-[12px] font-medium" style={{ color: '#98a2b3' }}>
          Ver todo
        </button>
      </div>

      <div className="px-5 pb-5 grid gap-4">
        {items.map(item => {
          const Icon = DashboardIcons[item.icon];
          return (
            <div key={item.id} className="grid grid-cols-[40px_1fr_auto] gap-4 items-center">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center"
                style={{ backgroundColor: iconBg(item.color), color: item.color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] font-medium truncate" style={{ color: dashboardTheme.text }}>
                    {item.label}
                  </div>
                  <div className="text-[11px] font-semibold" style={{ color: item.color }}>
                    {item.pct}%
                  </div>
                </div>
                <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: dashboardTheme.ring }}>
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>

              <div className="text-[12px] font-medium tabular-nums" style={{ color: '#98a2b3' }}>
                {formatCurrency(item.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
