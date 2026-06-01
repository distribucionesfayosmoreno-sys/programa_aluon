import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';
import { navigateToModule } from '../../../services/moduleNavigation';

type Count = { id: string; label: string; value: number };
type Recent = { id: string; label: string; estado: string; total: number; fechaIso: string };

type Props = {
  counts: Count[];
  recent: Recent[];
  formatCurrency: (value: number) => string;
};

const formatFecha = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
};

export const PresupuestosCard = ({ counts, recent, formatCurrency }: Props) => {
  const max = Math.max(...counts.map(c => c.value), 1);

  return (
    <DashboardCard
      title="Presupuestos"
      accentColor={dashboardTheme.accentBars.expenses}
      right={(
        <button
          type="button"
          className="btn-ghost px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider"
          onClick={() => navigateToModule('presupuestos')}
        >
          Ver módulo
        </button>
      )}
    >
      <div className="grid gap-5">
        <div className="grid grid-cols-3 gap-4 items-end">
          {counts.slice(0, 3).map((bar, idx) => {
            const height = Math.round((bar.value / max) * 64);
            const colors = ['#f59e0b', '#22c55e', '#6366f1'];
            const color = colors[idx % colors.length];
            return (
              <div key={bar.id} className="text-center">
                <div className="text-[10px] font-semibold" style={{ color: '#98a2b3' }}>
                  {bar.value}
                </div>
                <div className="mt-2 h-16 flex items-end justify-center">
                  <div className="w-14 rounded-[10px]" style={{ height, backgroundColor: color }} />
                </div>
                <div className="mt-2 text-[10px] font-medium" style={{ color: '#98a2b3' }}>
                  {bar.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          {recent.slice(0, 5).map(item => (
            <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
              <div className="min-w-0">
                <div className="text-[12px] font-medium truncate" style={{ color: dashboardTheme.text }}>
                  {item.label}
                </div>
                <div className="text-[10px] font-semibold mt-1" style={{ color: '#98a2b3' }}>
                  {item.estado} · {item.id}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-semibold tabular-nums" style={{ color: '#16a34a' }}>
                  {formatCurrency(item.total)}
                </div>
                <div className="text-[10px] font-medium mt-0.5" style={{ color: '#98a2b3' }}>
                  {formatFecha(item.fechaIso)}
                </div>
              </div>
            </div>
          ))}
          {recent.length === 0 ? (
            <div className="text-[12px] font-medium" style={{ color: '#98a2b3' }}>
              No hay presupuestos en este rango.
            </div>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
};
