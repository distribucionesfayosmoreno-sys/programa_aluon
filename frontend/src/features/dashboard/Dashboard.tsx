import type { FC } from 'react';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { useDashboardOperations } from './hooks/useDashboardOperations';
import { useDashboardAlerts } from './hooks/useDashboardAlerts';

const toneStyles: Record<'neutral' | 'success' | 'warning' | 'danger', { bg: string; text: string; pill: string }> = {
  neutral: { bg: '#f8f9fb', text: '#0d1117', pill: '#e8eaed' },
  success: { bg: '#ecfdf3', text: '#0f5132', pill: '#b7ebc6' },
  warning: { bg: 'var(--notice-bg)', text: 'var(--notice-text)', pill: 'var(--notice-border)' },
  danger: { bg: 'var(--danger-bg)', text: 'var(--danger-text)', pill: 'var(--danger-pill)' },
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
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, var(--accent-shadow-soft-2), rgba(248,249,251,0.9))',
          borderColor: '#e8eaed',
        }}
      >
        <div>
          <h1 className="text-2xl font-black uppercase" style={{ color: '#0d1117' }}>
            Dashboard operativo
          </h1>
          <p className="text-sm" style={{ color: '#8b949e' }}>
            KPIs en tiempo real para el equipo de cerrajería.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: status === 'error' ? 'var(--danger-pill)' : '#e8eaed', color: '#57606a' }}
          >
            {status === 'error' ? 'Offline' : 'Live'}
          </span>
          <span className="text-xs" style={{ color: '#8b949e' }}>
            {updatedLabel}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map(kpi => {
          const tone = toneStyles[kpi.tone];
          return (
            <article
              key={kpi.label}
              className="p-5 rounded-2xl border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e8eaed' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                  {kpi.label}
                </span>
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ backgroundColor: tone.pill, color: tone.text }}
                >
                  {kpi.trend}
                </span>
              </div>
              <div className="mt-4 text-3xl font-black" style={{ color: tone.text }}>
                {kpi.value}
              </div>
              <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: tone.bg }}>
                <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: tone.text, opacity: 0.35 }} />
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
        </section>

        <section className="p-6 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e8eaed' }}>
          <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Alertas clave</h2>
          <ul className="mt-4 space-y-3">
            {alerts.map(alert => (
              <li
                key={alert.title}
                className="p-3 rounded-xl"
                style={{ backgroundColor: alert.tone === 'danger' ? 'var(--danger-bg)' : '#f8f9fb' }}
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
