import { DashboardCard } from './DashboardCard';
import { dashboardTheme } from '../dashboardTheme';
import { navigateToModule } from '../../../services/moduleNavigation';

export const DocumentsAccessCard = () => (
  <DashboardCard
    title="Gestión Documentos"
    accentColor="#2563eb"
    right={(
      <button
        type="button"
        className="btn-ghost px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider"
        onClick={() => navigateToModule('gestion-documentos')}
      >
        Abrir módulo
      </button>
    )}
  >
    <div className="grid gap-3">
      <p className="text-[12px] leading-5 font-medium" style={{ color: dashboardTheme.text }}>
        Revisa presupuestos, pedidos, albaranes, facturas y abonos desde una sola vista operativa.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border px-3 py-2 text-left transition hover:bg-slate-50"
          style={{ borderColor: dashboardTheme.border, background: '#ffffff' }}
          onClick={() => navigateToModule('gestion-documentos')}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: '#64748b' }}>
            Documentos
          </div>
          <div className="mt-1 text-sm font-semibold" style={{ color: dashboardTheme.text }}>
            Ver listado
          </div>
        </button>

        <button
          type="button"
          className="rounded-xl border px-3 py-2 text-left transition hover:bg-slate-50"
          style={{ borderColor: dashboardTheme.border, background: '#ffffff' }}
          onClick={() => navigateToModule('clientes')}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: '#64748b' }}>
            CRM
          </div>
          <div className="mt-1 text-sm font-semibold" style={{ color: dashboardTheme.text }}>
            Ir a clientes
          </div>
        </button>
      </div>
    </div>
  </DashboardCard>
);
