import { useState } from 'react';
import type { ProjectDocumentRow, WorkOrderWorkflowStep } from '../ProjectManagement.types';

type ProjectsTableProps = {
  rows: ProjectDocumentRow[];
  busyProjectId: string | null;
  onOpenDetails: (row: ProjectDocumentRow) => void;
  onEdit: (projectId: string) => void;
  onApproveBudget: (projectId: string) => void;
  onSetWorkOrderStep: (projectId: string, step: WorkOrderWorkflowStep) => void;
  onFinalizeToDeliveryNote: (projectId: string) => void;
  onInvoice: (projectId: string) => void;
  onCreditNote: (projectId: string) => void;
};

// ─── Column header ────────────────────────────────────────────────────────────
const TH = ({ label, right }: { label: string; right?: boolean }) => (
  <th
    className={`px-3 py-2 whitespace-nowrap select-none group ${right ? 'text-right' : 'text-left'}`}
    style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}
  >
    <span className="flex items-center gap-1 group-hover:text-gray-900 transition-colors" style={{ justifyContent: right ? 'flex-end' : 'flex-start' }}>
      {label}
    </span>
  </th>
);

// ─── Badges ───────────────────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, { bg: string; color: string }> = {
    'PRESUPUESTO': { bg: '#dbeafe', color: '#1e40af' }, // blue
    'PEDIDO': { bg: '#fef3c7', color: '#92400e' }, // yellow
    'ALBARAN': { bg: '#f0fdf4', color: '#15803d' }, // green
    'FACTURA': { bg: '#fae8ff', color: '#7c3aed' }, // purple
    'ABONO': { bg: '#ffe4e6', color: '#9f1239' }, // rose
  };
  const style = map[type] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
      style={{ background: style.bg, color: style.color, fontSize: 10 }}
    >
      {type}
    </span>
  );
};

const ActionButton = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
    style={{ border: '1px solid #e5e7eb', background: '#fff', color: disabled ? '#9ca3af' : '#374151', fontSize: 10 }}
    disabled={disabled}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    {label}
  </button>
);

export const ProjectsTable = ({
  rows,
  busyProjectId,
  onOpenDetails,
  onEdit,
  onApproveBudget,
  onSetWorkOrderStep,
  onFinalizeToDeliveryNote,
  onInvoice,
  onCreditNote,
}: ProjectsTableProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map(r => r.rowId)));
    }
  };

  const allSelected = rows.length > 0 && selected.size === rows.length;

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selected.size > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'var(--notice-bg, #f0fdf4)', color: 'var(--notice-text, #15803d)', border: '1px solid var(--notice-border, #bbf7d0)' }}
            >
              {selected.size} seleccionado{selected.size > 1 ? 's' : ''}
              <button
                onClick={() => setSelected(new Set())}
                className="ml-1 opacity-60 hover:opacity-100"
              >✕</button>
            </div>
          )}
          <div className="relative hidden md:block flex-1 min-w-0 max-w-sm">
            <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Buscar documento..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm border"
              style={{ border: '1px solid #e5e7eb', fontSize: 12, outline: 'none', background: '#fff', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Table container ── */}
      <div
        className="flex-1 rounded-2xl overflow-hidden flex flex-col min-h-0"
        style={{ border: '1px solid #e5e7eb', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse" style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', width: 36 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded cursor-pointer"
                    style={{ accentColor: 'var(--accent, #3b82f6)', width: 14, height: 14 }}
                  />
                </th>
                <TH label="Cliente" />
                <TH label="Tipo" />
                <TH label="Número" />
                <TH label="Estado" />
                <TH label="OT" />
                <TH label="Acciones" right />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm" style={{ color: '#374151' }}>No hay proyectos</p>
                        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Genera un presupuesto y guárdalo para que aparezca aquí.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map(row => {
                  const busy = busyProjectId === row.projectId;
                  const canApprove = row.type === 'PRESUPUESTO';
                  const canView = row.quoteId !== null;
                  const canEdit = row.type === 'PRESUPUESTO';
                  const canFinalize = row.type === 'PEDIDO';
                  const canInvoice = row.type === 'ALBARAN';
                  const canCredit = row.type === 'FACTURA';
                  const isChecked = selected.has(row.rowId);

                  return (
                    <tr
                      key={row.rowId}
                      className="group transition-colors duration-100"
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        background: isChecked ? 'var(--accent-soft, #eff6ff)' : 'transparent',
                        cursor: 'default',
                      }}
                      onClick={() => onOpenDetails(row)}
                      onMouseEnter={e => { if (!isChecked) e.currentTarget.style.background = '#f9fafb'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isChecked ? 'var(--accent-soft, #eff6ff)' : 'transparent'; }}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(row.rowId)}
                          className="rounded cursor-pointer"
                          style={{ accentColor: 'var(--accent, #3b82f6)', width: 14, height: 14 }}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {isChecked && (
                            <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: 'var(--accent, #3b82f6)' }} />
                          )}
                          <span className="font-semibold" style={{ color: '#111827' }}>
                            {row.customerName || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <TypeBadge type={row.type} />
                      </td>
                      <td className="px-3 py-2.5 font-medium" style={{ color: '#374151' }}>
                        {row.number || '—'}
                      </td>
                      <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>
                        {row.statusLabel || '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs"
                          style={{ background: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: 600 }}
                        >
                          {row.type === 'PEDIDO' ? (row.workOrderStep ?? '—') : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <ActionButton
                            label={busy ? '...' : 'VER'}
                            disabled={!canView || busy}
                            onClick={() => onOpenDetails(row)}
                          />
                          <ActionButton
                            label="EDITAR"
                            disabled={!canEdit || busy}
                            onClick={() => onEdit(row.projectId)}
                          />
                          <ActionButton
                            label={busy ? '...' : 'Aprobar'}
                            disabled={!canApprove || busy}
                            onClick={() => onApproveBudget(row.projectId)}
                          />
                          <ActionButton
                            label="OT: DEV"
                            disabled={row.type !== 'PEDIDO' || busy}
                            onClick={() => onSetWorkOrderStep(row.projectId, 'DEV')}
                          />
                          <ActionButton
                            label="OT: PROD"
                            disabled={row.type !== 'PEDIDO' || busy}
                            onClick={() => onSetWorkOrderStep(row.projectId, 'PROD')}
                          />
                          <ActionButton
                            label="Finalizar"
                            disabled={!canFinalize || busy}
                            onClick={() => onFinalizeToDeliveryNote(row.projectId)}
                          />
                          <ActionButton
                            label="Facturar"
                            disabled={!canInvoice || busy}
                            onClick={() => onInvoice(row.projectId)}
                          />
                          <ActionButton
                            label="Abonar"
                            disabled={!canCredit || busy}
                            onClick={() => onCreditNote(row.projectId)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer bar ── */}
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          style={{ borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}
        >
          <div className="flex items-center gap-4 text-xs" style={{ color: '#6b7280' }}>
            <span>
              <strong style={{ color: '#111827' }}>{rows.length}</strong> proyectos
            </span>
            {selected.size > 0 && (
              <span style={{ color: 'var(--accent, #3b82f6)', fontWeight: 700 }}>
                {selected.size} seleccionado{selected.size > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7280' }}>
            <span>Por página:</span>
            <select
              className="rounded px-2 py-1 text-xs border"
              style={{ border: '1px solid #e5e7eb', outline: 'none', background: '#fff', fontSize: 11 }}
            >
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <div className="flex items-center gap-0.5 ml-2">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white border border-transparent hover:border-gray-200 transition-all" style={{ color: '#9ca3af' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: 'var(--accent, #3b82f6)', color: '#fff', minWidth: 24, textAlign: 'center' }}>1</span>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white border border-transparent hover:border-gray-200 transition-all" style={{ color: '#9ca3af' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
