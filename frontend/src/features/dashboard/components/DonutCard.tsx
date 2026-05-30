import type { DonutSlice } from '../Dashboard.types';
import { dashboardTheme } from '../dashboardTheme';
import { DashboardTabs } from './DashboardTabs';
import { DonutChart } from './charts/DonutChart';
import type { DashboardTimeRange } from '../Dashboard.types';

type Props = {
  title: 'Ingresos' | 'Gastos';
  accentColor: string;
  range: DashboardTimeRange;
  onRangeChange: (range: DashboardTimeRange) => void;
  totalAmountLabel: string;
  deltaAmountLabel: string;
  slices: DonutSlice[];
  legend: Array<{ id: string; label: string; color: string }>;
  totalLabel: string;
};

export const DonutCard = ({
  title,
  accentColor,
  range,
  onRangeChange,
  totalLabel,
  totalAmountLabel,
  deltaAmountLabel,
  slices,
  legend,
}: Props) => {
  return (
    <section
      className="rounded-[18px] border bg-white overflow-hidden shadow-[0_18px_40px_rgba(16,24,40,0.08)]"
      style={{ borderColor: dashboardTheme.border }}
    >
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
            <div className="text-[14px] font-semibold" style={{ color: dashboardTheme.text }}>
              {title}
            </div>
          </div>
          <DashboardTabs value={range} onChange={onRangeChange} ariaLabel={`${title} range`} />
        </div>
      </div>

      <div className="px-5 pb-5 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="mx-auto md:mx-0">
            <DonutChart
              size={190}
            stroke={18}
            slices={slices}
            centerTopLabel={totalLabel}
            centerAmountLabel={totalAmountLabel}
            centerBottomLabel={deltaAmountLabel}
            centerBottomTone={title === 'Ingresos' ? 'negative' : 'positive'}
            />
          </div>
          <div className="min-w-0">
            <div className="grid gap-3">
              {legend.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
                  <span className="text-[12px] font-medium truncate" style={{ color: dashboardTheme.muted }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
