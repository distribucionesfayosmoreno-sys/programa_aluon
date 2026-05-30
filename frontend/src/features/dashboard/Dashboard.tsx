import type { FC } from 'react';
import { dashboardTheme } from './dashboardTheme';
import { DonutCard } from './components/DonutCard';
import { HistogramCard } from './components/HistogramCard';
import { MiniTiles } from './components/MiniTiles';
import { OverviewList } from './components/OverviewList';
import { PresupuestosCard } from './components/PresupuestosCard';
import { OrdenesTrabajoCard } from './components/OrdenesTrabajoCard';
import { TransactionsCard } from './components/TransactionsCard';
import { TrendCard } from './components/TrendCard';
import { useDashboardViewModel } from './hooks/useDashboardViewModel';

const Dashboard: FC = () => {
  const vm = useDashboardViewModel();

  return (
    <section className="h-full min-h-0 w-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="w-full grid gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutCard
                  title={vm.income.title}
                  accentColor={dashboardTheme.accentBars.income}
                  range={vm.incomeRange}
                  onRangeChange={vm.onIncomeRangeChange}
                  totalLabel={vm.income.totalLabel}
                  totalAmountLabel={vm.formatCurrency(vm.income.totalAmount)}
                  deltaAmountLabel={vm.formatCurrency(vm.income.innerDeltaAmount)}
                  slices={vm.income.slices}
                  legend={vm.income.legend}
                />
                <DonutCard
                  title={vm.expenses.title}
                  accentColor={dashboardTheme.accentBars.expenses}
                  range={vm.expensesRange}
                  onRangeChange={vm.onExpensesRangeChange}
                  totalLabel={vm.expenses.totalLabel}
                  totalAmountLabel={vm.formatCurrency(vm.expenses.totalAmount)}
                  deltaAmountLabel={vm.formatCurrency(vm.expenses.innerDeltaAmount)}
                  slices={vm.expenses.slices}
                  legend={vm.expenses.legend}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OverviewList
                  title="Resumen de ingresos"
                  accentColor="#8b5cf6"
                  items={vm.incomeOverview}
                  formatCurrency={vm.formatCurrency}
                />
                <OverviewList
                  title="Resumen de gastos"
                  accentColor={dashboardTheme.accentBars.income}
                  items={vm.expensesOverview}
                  formatCurrency={vm.formatCurrency}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PresupuestosCard
                  counts={vm.presupuestos.counts}
                  recent={vm.presupuestos.recent}
                  formatCurrency={vm.formatCurrency}
                />
                <OrdenesTrabajoCard
                  byStep={vm.ordenes.byStep}
                  recent={vm.ordenes.recent}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionsCard items={vm.transactions} formatCurrency={vm.formatCurrency} />
                <HistogramCard items={vm.histogram} />
              </div>
            </div>

            <aside className="grid gap-6">
              <MiniTiles tiles={vm.tiles} formatCurrency={vm.formatCurrency} />
              <TrendCard monthLabel={vm.trend.monthLabel} points={vm.trend.points} />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
