import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';
import { navigateToModule } from '../../../services/moduleNavigation';

type Count = { id: string; label: string; value: number };
type Recent = { id: string; codigo: string; cliente: string; etapa: string; estado: string; fechaIso: string; asignadoA: string | null };

type Props = {
  byStep: Count[];
  recent: Recent[];
  onRowClick?: (row: Recent) => void;
};

const formatFecha = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
};

export const OrdenesTrabajoCard = ({ byStep, recent, onRowClick }: Props) => {
  const max = Math.max(...byStep.map(c => c.value), 1);
  const colors = ['#22c55e', '#3aa0ff', '#a855f7', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

  return (
    <DashboardCard
      title="Órdenes de trabajo"
      accentColor={dashboardTheme.accentBars.income}
      right={(
        <button
          type="button"
          className="btn-ghost px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider"
          onClick={() => navigateToModule('ordenes')}
        >
          Ver módulo
        </button>
      )}
    >
      <div className="grid gap-5">
        <div className="grid grid-cols-4 gap-4 items-end">
          {byStep.slice(0, 4).map((bar, idx) => {
            const height = Math.round((bar.value / max) * 56);
            const color = colors[idx % colors.length];
            return (
              <div key={bar.id} className="text-center">
                <div className="text-[10px] font-semibold" style={{ color: '#98a2b3' }}>{bar.value}</div>
                <div className="mt-2 h-14 flex items-end justify-center">
                  <div className="w-12 rounded-[10px]" style={{ height, backgroundColor: color }} />
                </div>
                <div className="mt-2 text-[10px] font-medium" style={{ color: '#98a2b3' }}>{bar.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          {recent.slice(0, 6).map(item => {
            const body = (
              <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <div className="min-w-0">
                  <div className="text-[12px] font-medium truncate" style={{ color: dashboardTheme.text }}>
                    {item.codigo} · {item.cliente}
                  </div>
                  <div className="text-[10px] font-semibold mt-1" style={{ color: '#98a2b3' }}>
                    {item.etapa} · {item.estado}{item.asignadoA ? ` · ${item.asignadoA}` : ''}
                  </div>
                </div>
                <div className="text-[10px] font-medium mt-0.5 text-right" style={{ color: '#98a2b3' }}>
                  {formatFecha(item.fechaIso)}
                </div>
              </div>
            );

            return onRowClick ? (
              <button
                key={item.id}
                type="button"
                className="w-full rounded-xl border px-3 py-2 text-left transition hover:bg-slate-50"
                style={{ borderColor: '#eef2f7', background: '#ffffff' }}
                onClick={() => onRowClick(item)}
              >
                {body}
              </button>
            ) : (
              <div key={item.id}>{body}</div>
            );
          })}
          {recent.length === 0 ? (
            <div className="text-[12px] font-medium" style={{ color: '#98a2b3' }}>
              No hay órdenes en este rango.
            </div>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
};
