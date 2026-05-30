import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';

type Item = { id: string; label: string; value: number };

type Props = { items: Item[] };

const colors = ['#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export const HistogramCard = ({ items }: Props) => {
  const max = Math.max(...items.map(i => i.value), 1);

  return (
    <DashboardCard title="Histograma" accentColor={dashboardTheme.accentBars.histogram}>
      <div className="grid gap-2.5">
        {items.slice(0, 6).map((item, idx) => {
          const widthPct = Math.round((item.value / max) * 100);
          const color = colors[idx % colors.length];
          return (
            <div key={item.id} className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(168,85,247,0.08)' }}>
              <div className="h-full rounded-lg" style={{ width: `${widthPct}%`, backgroundColor: color }} />
              <div className="absolute inset-0 flex items-center justify-end pr-3 text-[11px] font-semibold text-white">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};
