import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';

type Bar = { id: string; label: string; value: number };

type Props = { bars: Bar[] };

const barColors = ['#22c55e', '#f59e0b', '#6366f1', '#f43f5e'];

export const PaymentIssuesCard = ({ bars }: Props) => {
  const max = Math.max(...bars.map(b => b.value), 1);

  return (
    <DashboardCard title="Incidencias de pago" accentColor={dashboardTheme.accentBars.issues}>
      <div className="grid grid-cols-4 gap-4 items-end">
        {bars.slice(0, 4).map((bar, idx) => {
          const height = Math.round((bar.value / max) * 64);
          const color = barColors[idx % barColors.length];
          return (
            <div key={bar.id} className="text-center">
              <div className="text-[10px] font-semibold" style={{ color: '#98a2b3' }}>{bar.value}</div>
              <div className="mt-2 h-16 flex items-end justify-center">
                <div className="w-12 rounded-[10px]" style={{ height, backgroundColor: color }} />
              </div>
              <div className="mt-2 text-[10px] font-medium" style={{ color: '#98a2b3' }}>
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};
