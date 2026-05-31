import { useProjectsOverview } from './useProjectsOverview';

export const ProjectsOverviewPage = () => {
  const vm = useProjectsOverview();

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      {vm.error ? (
        <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {vm.error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="text-xs font-black uppercase tracking-wide" style={{ color: '#6b7280' }}>
          Proyectos
        </div>
        <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>
          ({vm.rows.length})
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="overflow-auto h-full">
          <table className="w-full border-collapse" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  Cliente
                </th>
                <th className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  Presupuesto
                </th>
                <th className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  Estado
                </th>
                <th className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  Fecha
                </th>
                <th className="px-3 py-2 text-right" style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {vm.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center" style={{ color: '#9ca3af' }}>
                    No hay proyectos todavía.
                  </td>
                </tr>
              ) : (
                vm.rows.map(row => (
                  <tr key={row.projectId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: '#111827' }}>{row.customerName || '—'}</td>
                    <td className="px-3 py-2.5 font-medium" style={{ color: '#374151' }}>{row.quoteNumber || '—'}</td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{row.statusLabel || '—'}</td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{row.createdAt || '—'}</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-md font-semibold transition-all hover:bg-gray-50"
                          style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 10 }}
                          onClick={() => void vm.actions.view(row.projectId)}
                        >
                          VER
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-md font-semibold transition-all hover:bg-gray-50"
                          style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 10 }}
                          onClick={() => vm.actions.edit(row.projectId)}
                        >
                          EDITAR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

