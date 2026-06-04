import type { ProjectDocumentKind } from '../ProjectManagement.types';
import type { ProjectsTableFilters } from './ProjectsTableFilters.types';
import { documentManagementTheme } from '../documentManagementTheme';

type Props = {
  filters: ProjectsTableFilters;
  onChange: (next: ProjectsTableFilters) => void;
  onReset: () => void;
  onCreateDocument: () => void;
  typeOptions: ProjectDocumentKind[];
  statusOptions: string[];
};

const controlBase =
  'rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2';

export const ProjectsTableFiltersBar = ({
  filters,
  onChange,
  onReset,
  onCreateDocument,
  typeOptions,
  statusOptions,
}: Props) => (
  <div
    className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3"
    style={{
      border: `1px solid ${documentManagementTheme.border}`,
      background: documentManagementTheme.panelBg,
      borderRadius: 18,
      padding: 12,
      boxShadow: documentManagementTheme.shadowSoft,
    }}
  >
    <div className="flex-1 min-w-0">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
        Buscar
      </label>
      <input
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        placeholder="Cliente, número, tipo o estado..."
        className={`${controlBase} w-full`}
        style={{
          borderColor: documentManagementTheme.border,
          fontSize: 12,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
          boxShadow: '0 0 0 0 rgba(0,0,0,0)',
        }}
      />
    </div>

    <div className="w-full md:w-44">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
        Tipo
      </label>
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as ProjectsTableFilters['type'] })}
        className={`${controlBase} w-full`}
        style={{
          borderColor: documentManagementTheme.border,
          fontSize: 12,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
        }}
      >
        <option value="ALL">Todos</option>
        {typeOptions.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>

    <div className="w-full md:w-56">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
        Estado
      </label>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className={`${controlBase} w-full`}
        style={{
          borderColor: documentManagementTheme.border,
          fontSize: 12,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
        }}
      >
        <option value="ALL">Todos</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    <div className="w-full md:w-40">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
        Desde
      </label>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        className={`${controlBase} w-full`}
        style={{
          borderColor: documentManagementTheme.border,
          fontSize: 12,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
        }}
      />
    </div>

    <div className="w-full md:w-40">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
        Hasta
      </label>
      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        className={`${controlBase} w-full`}
        style={{
          borderColor: documentManagementTheme.border,
          fontSize: 12,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
        }}
      />
    </div>

    <div className="flex items-center gap-2 md:justify-end md:pb-0.5">
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-2 rounded-xl font-bold"
        style={{
          border: `1px solid ${documentManagementTheme.border}`,
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
          fontSize: 12,
          boxShadow: documentManagementTheme.shadowSoft,
        }}
      >
        Limpiar
      </button>
      <button
        type="button"
        onClick={onCreateDocument}
        className="px-3 py-2 rounded-xl font-bold text-white"
        style={{
          border: '1px solid #1d4ed8',
          background: '#2563eb',
          color: '#ffffff',
          fontSize: 12,
          boxShadow: documentManagementTheme.shadowSoft,
        }}
      >
        Nuevo documento
      </button>
    </div>
  </div>
);
