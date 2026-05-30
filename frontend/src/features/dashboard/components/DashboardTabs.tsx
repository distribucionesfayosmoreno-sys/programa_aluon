import type { DashboardTimeRange } from '../Dashboard.types';
import { dashboardTheme } from '../dashboardTheme';

type Tab = { id: DashboardTimeRange; label: string };
const tabs: Tab[] = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
  { id: 'year', label: 'Año' },
];

type Props = {
  value: DashboardTimeRange;
  onChange: (value: DashboardTimeRange) => void;
  ariaLabel: string;
};

export const DashboardTabs = ({ value, onChange, ariaLabel }: Props) => {
  return (
    <div className="flex items-center gap-6" role="tablist" aria-label={ariaLabel}>
      {tabs.map(tab => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className="relative text-[12px] font-medium leading-none transition-colors"
            style={{ color: active ? dashboardTheme.tab.active : dashboardTheme.tab.idle }}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {active ? (
              <span
                className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-7 rounded-full"
                style={{ backgroundColor: dashboardTheme.tab.active }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
