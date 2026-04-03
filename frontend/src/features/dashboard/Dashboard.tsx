import type { FC } from 'react';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { useDashboardOperations } from './hooks/useDashboardOperations';
import { useDashboardAlerts } from './hooks/useDashboardAlerts';

const toneStyles: Record<'neutral' | 'success' | 'warning' | 'danger', { bg: string; text: string; pill: string; line: string }> = {
  neutral: { bg: '#f8f9fb', text: '#0d1117', pill: '#e8eaed', line: '#d1d5db' },
  success: { bg: '#ecfdf3', text: '#0f5132', pill: '#b7ebc6', line: '#16a34a' },
  warning: { bg: 'var(--notice-bg)', text: 'var(--notice-text)', pill: 'var(--notice-border)', line: '#f59e0b' },
  danger: { bg: 'var(--danger-bg)', text: 'var(--danger-text)', pill: 'var(--danger-pill)', line: '#dc2626' },
};

const Sparkline = ({ points, tone }: { points: number[]; tone: keyof typeof toneStyles }) => {
  const width = 120;
  const height = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((value, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        fill="none"
        stroke={toneStyles[tone].line}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={coords}
        opacity="0.9"
      />
    </svg>
  );
};

const Dashboard: FC = () => {
  const { kpis, status, lastUpdated } = useDashboardKpis();
  const { data: operations } = useDashboardOperations();
  const { alerts } = useDashboardAlerts();
  const updatedLabel = lastUpdated
    ? `Actualizado ${lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
    : 'Actualizando...';

  return (
    <section className="space-y-6">
      <header
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-6 rounded-3xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,251,0.9))',
          borderColor: '#e8eaed',
        }}
      >
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#8b949e' }}>
            Visión operativa
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase" style={{ color: '#0d1117' }}>
            Dashboard operativo
          </h1>
          <p className="text-sm" style={{ color: '#8b949e' }}>
            KPIs diarios para producción, logística y validaciones.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ borderColor: '#e8eaed', color: '#57606a' }}>
            <span style={{ color: '#8b949e' }}>Rango</span>
            <select
              className="bg-transparent focus:outline-none"
              defaultValue="week"
              aria-label="Rango de fechas"
            >
              <option value="today">Hoy</option>
              <option value="week">Últimos 7 días</option>
              <option value="month">Mes actual</option>
              <option value="quarter">Trimestre</option>
            </select>
          </div>
          <div
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: status === 'error' ? 'var(--danger-pill)' : '#e8eaed', color: '#57606a' }}
          >
            {status === 'error' ? 'Offline' : 'Live'}
          </div>
          <div className="text-xs" style={{ color: '#8b949e' }}>
            {updatedLabel}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const tone = toneStyles[kpi.tone];
          const spark = [
            [12, 18, 16, 20, 22, 19, 24],
            [8, 10, 12, 14, 13, 16, 18],
            [6, 5, 7, 6, 9, 8, 7],
            [10, 11, 9, 12, 13, 12, 14],
          ][idx % 4];
          return (
            <article
              key={kpi.label}
              className="p-5 rounded-2xl border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e8eaed' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                    {kpi.label}
                  </div>
                  <div className="mt-3 text-3xl font-black" style={{ color: tone.text }}>
                    {kpi.value}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ backgroundColor: tone.pill, color: tone.text }}
                  >
                    {kpi.trend}
                  </div>
                  <Sparkline points={spark} tone={kpi.tone} />
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full" style={{ backgroundColor: tone.bg }}>
                <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: tone.text, opacity: 0.35 }} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 p-6 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e8eaed' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Operativa hoy</h2>
            <span className="text-xs" style={{ color: '#8b949e' }}>08:00 - 19:00</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'OT en ruta', value: String(operations.inRoute), note: '3 asignadas ahora' },
              { title: 'OT completadas', value: String(operations.completed), note: 'Meta diaria 24' },
              { title: 'Tiempo medio', value: `${operations.avgTimeMinutes} min`, note: 'Hoy 4% mejor' },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                  {item.title}
                </div>
                <div className="mt-2 text-2xl font-black" style={{ color: '#0d1117' }}>{item.value}</div>
                <div className="text-xs mt-1" style={{ color: '#8b949e' }}>{item.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Capacidad del día', value: `${operations.completed}/24`, pct: Math.min(100, Math.round((operations.completed / 24) * 100)) },
              { title: 'Tiempo medio vs objetivo', value: `${operations.avgTimeMinutes} min`, pct: Math.max(0, Math.min(100, 100 - (operations.avgTimeMinutes - 30) * 3)) },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-xl border" style={{ borderColor: '#e8eaed' }}>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                  {item.title}
                </div>
                <div className="mt-2 text-xl font-black" style={{ color: '#0d1117' }}>{item.value}</div>
                <div className="mt-3 h-2 rounded-full" style={{ backgroundColor: '#f3f4f6' }}>
                  <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
              Producción por etapa
            </div>
            <div className="mt-3 space-y-3">
              {[
                { label: 'Solicitud', value: 18, total: 40 },
                { label: 'Presupuesto', value: 12, total: 40 },
                { label: 'Validación', value: 9, total: 40 },
                { label: 'Desarrollo', value: 7, total: 40 },
                { label: 'Producción', value: 5, total: 40 },
                { label: 'Finalización', value: 3, total: 40 },
              ].map(stage => {
                const pct = Math.min(100, Math.round((stage.value / stage.total) * 100));
                return (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#0d1117', fontWeight: 700 }}>{stage.label}</span>
                      <span style={{ color: '#8b949e' }}>{stage.value}/{stage.total}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: '#f3f4f6' }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e8eaed' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Alertas clave</h2>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
              {alerts.length} alertas
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {alerts.map(alert => (
              <li
                key={alert.title}
                className="p-3 rounded-xl border"
                style={{
                  backgroundColor: alert.tone === 'danger' ? 'var(--danger-bg)' : '#f8f9fb',
                  borderColor: alert.tone === 'danger' ? 'var(--danger-pill)' : '#e8eaed',
                }}
              >
                <div className="text-xs font-black uppercase" style={{ color: '#0d1117' }}>{alert.title}</div>
                <div className="text-xs mt-1" style={{ color: '#8b949e' }}>{alert.detail}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
