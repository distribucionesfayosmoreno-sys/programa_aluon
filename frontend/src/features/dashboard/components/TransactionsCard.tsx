import type { DashboardTransaction } from '../Dashboard.types';
import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';

type Props = {
  items: DashboardTransaction[];
  formatCurrency: (value: number) => string;
};

export const TransactionsCard = ({ items, formatCurrency }: Props) => {
  return (
    <DashboardCard
      title="Transacciones"
      accentColor={dashboardTheme.accentBars.transactions}
      right={<button type="button" className="text-[12px] font-medium" style={{ color: '#98a2b3' }}>Ver todo</button>}
    >
      <div className="grid gap-4">
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="text-[12px] font-medium truncate" style={{ color: dashboardTheme.text }}>{item.title}</div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: '#98a2b3' }}>
                {item.subtitle}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-[12px] font-semibold tabular-nums"
                style={{ color: item.tone === 'in' ? '#16a34a' : '#ef4444' }}
              >
                {item.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(item.amount))}
              </div>
              <div className="text-[10px] font-medium mt-0.5" style={{ color: '#98a2b3' }}>
                {item.atLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};
