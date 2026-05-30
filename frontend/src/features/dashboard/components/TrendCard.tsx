import { DashboardCard } from './DashboardCard';
import { LineAreaChart } from './charts/LineAreaChart';
import { dashboardTheme } from '../dashboardTheme';

type Props = {
  monthLabel: string;
  points: number[];
};

export const TrendCard = ({ monthLabel, points }: Props) => {
  return (
    <DashboardCard
      title="Tendencia"
      accentColor={dashboardTheme.accentBars.income}
      right={<span className="text-[12px] font-medium" style={{ color: '#98a2b3' }}>{monthLabel}</span>}
    >
      <div className="rounded-2xl p-3" style={{ background: 'linear-gradient(180deg, rgba(77,163,255,0.08), rgba(255,255,255,0))' }}>
        <LineAreaChart width={520} height={140} points={points} className="block w-full h-[140px]" />
      </div>
    </DashboardCard>
  );
};
