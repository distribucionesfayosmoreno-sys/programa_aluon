import type { FC } from 'react';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { useDashboardOperations } from './hooks/useDashboardOperations';
import { useDashboardAlerts } from './hooks/useDashboardAlerts';

const toneStyles: Record<'neutral' | 'success' | 'warning' | 'danger', { bg: string; text: string; pill: string; line: string; gradient: string }> = {
  neutral: { bg: '#f8f9fb', text: '#0d1117', pill: '#e8eaed', line: '#d1d5db', gradient: 'from-slate-300 to-slate-400' },
  success: { bg: '#ecfdf3', text: '#0f5132', pill: '#b7ebc6', line: '#16a34a', gradient: 'from-emerald-400 to-green-500' },
  warning: { bg: 'var(--notice-bg)', text: 'var(--notice-text)', pill: 'var(--notice-border)', line: '#f59e0b', gradient: 'from-amber-400 to-orange-400' },
  danger: { bg: 'var(--danger-bg)', text: 'var(--danger-text)', pill: 'var(--danger-pill)', line: '#dc2626', gradient: 'from-red-400 to-rose-500' },
};

// Icons
const TrendUpIcon = () => <svg className="w-3 h-3 ml-1 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const TrendDownIcon = () => <svg className="w-3 h-3 ml-1 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const AlertCircleIcon = () => <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const InfoCircleIcon = () => <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const CheckCircleIcon = () => <svg className="w-12 h-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

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
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="drop-shadow-sm">
      <polyline
        fill="none"
        stroke={toneStyles[tone].line}
        strokeWidth="2.5"
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
    <section className="h-full flex flex-col gap-5 overflow-hidden">
      <header
        className="flex-shrink-0 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 rounded-3xl border transition-all duration-300 hover:shadow-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,251,0.95))',
          borderColor: '#e8eaed',
        }}
      >
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Visión operativa
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 mt-1">
            Dashboard operativo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            KPIs diarios para producción, logística y validaciones.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white shadow-sm transition-colors hover:border-slate-300">
            <span className="text-slate-400">Rango</span>
            <select
              className="bg-transparent focus:outline-none text-slate-700 font-bold cursor-pointer"
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
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${status === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
            {status === 'error' ? 'Offline' : 'Live'}
          </div>
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {updatedLabel}
          </div>
        </div>
      </header>

      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const tone = toneStyles[kpi.tone];
          const spark = [
            [12, 18, 16, 20, 22, 19, 24],
            [8, 10, 12, 14, 13, 16, 18],
            [6, 5, 7, 6, 9, 8, 7],
            [10, 11, 9, 12, 13, 12, 14],
          ][idx % 4];
          
          const isUp = kpi.trend.startsWith('+') || kpi.trend.includes('arriba');
          const isDown = kpi.trend.startsWith('-') || kpi.trend.includes('abajo');

          return (
            <article
              key={kpi.label}
              className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                    {kpi.label}
                  </div>
                  <div className="mt-2 text-3xl font-black tracking-tight" style={{ color: tone.text }}>
                    {kpi.value}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div
                    className="flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: tone.pill, color: tone.text }}
                  >
                    {kpi.trend}
                    {isUp && <TrendUpIcon />}
                    {isDown && <TrendDownIcon />}
                  </div>
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <Sparkline points={spark} tone={kpi.tone} />
                  </div>
                </div>
              </div>
              <div className="mt-5 h-2 rounded-full overflow-hidden bg-slate-100">
                <div className={`h-full rounded-full bg-gradient-to-r ${tone.gradient} opacity-80`} style={{ width: '72%' }} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-5 min-h-0">
        <section className="xl:col-span-2 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-sm font-black uppercase text-slate-900">Operativa hoy</h2>
            </div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              08:00 - 19:00
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
            {[
              { title: 'OT en ruta', value: String(operations.inRoute), note: '3 asignadas ahora', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16" /> },
              { title: 'OT completadas', value: String(operations.completed), note: 'Meta diaria 24', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { title: 'Tiempo medio', value: `${operations.avgTimeMinutes} min`, note: 'Hoy 4% mejor', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-slate-50 transition-colors hover:bg-slate-100 group">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-500">
                    {item.title}
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {item.icon}
                  </svg>
                </div>
                <div className="mt-2 text-2xl font-black text-slate-800">{item.value}</div>
                <div className="text-xs mt-1 font-medium text-slate-400">{item.note}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Capacidad del día', value: `${operations.completed}/24`, pct: Math.min(100, Math.round((operations.completed / 24) * 100)), color: 'from-blue-400 to-indigo-500' },
              { title: 'Tiempo medio vs objetivo', value: `${operations.avgTimeMinutes} min`, pct: Math.max(0, Math.min(100, 100 - (operations.avgTimeMinutes - 30) * 3)), color: 'from-emerald-400 to-teal-500' },
            ].map(item => (
              <div key={item.title} className="p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.title}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{item.pct}%</span>
                </div>
                <div className="mt-2 text-xl font-black text-slate-800">{item.value}</div>
                <div className="mt-4 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Producción por etapa
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {[
                { label: 'Solicitud', value: 18, total: 40 },
                { label: 'Presupuesto', value: 12, total: 40 },
                { label: 'Validación', value: 9, total: 40 },
                { label: 'Desarrollo', value: 7, total: 40 },
                { label: 'Producción', value: 5, total: 40 },
                { label: 'Finalización', value: 3, total: 40 },
              ].map((stage, i) => {
                const pct = Math.min(100, Math.round((stage.value / stage.total) * 100));
                // Add a slight delay to animation depending on index
                return (
                  <div key={stage.label} className="group">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{stage.label}</span>
                      <span className="font-semibold text-slate-400">{stage.value}/{stage.total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${pct}%`, transitionDelay: `${i * 50}ms` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md flex flex-col min-h-0">
          <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-sm font-black uppercase text-slate-900">Alertas clave</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
              {alerts.length} alertas
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar min-h-0">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8 text-center">
                <CheckCircleIcon />
                <p className="mt-2 text-xs font-medium">Todo en orden, sin alertas</p>
              </div>
            ) : (
              alerts.map((alert, idx) => (
                <div
                  key={`${alert.title}-${idx}`}
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm flex gap-3 items-start ${
                    alert.tone === 'danger' 
                      ? 'bg-red-50/50 border-red-100' 
                      : 'bg-amber-50/50 border-amber-100'
                  }`}
                >
                  <div className={alert.tone === 'danger' ? 'text-red-500 mt-0.5' : 'text-amber-500 mt-0.5'}>
                    {alert.tone === 'danger' ? <AlertCircleIcon /> : <InfoCircleIcon />}
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase ${alert.tone === 'danger' ? 'text-red-900' : 'text-amber-900'}`}>
                      {alert.title}
                    </div>
                    <div className={`text-xs mt-1.5 font-medium leading-relaxed ${alert.tone === 'danger' ? 'text-red-700/80' : 'text-amber-700/80'}`}>
                      {alert.detail}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
