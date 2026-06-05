import type { ProjectDocumentKind } from '../ProjectManagement.types';
import { documentManagementTheme } from '../documentManagementTheme';

const DOCUMENT_TYPES: Array<Exclude<ProjectDocumentKind, 'PRESUPUESTO'>> = ['PEDIDO', 'ALBARAN', 'FACTURA', 'ABONO'];

type ManualDocumentDrawerValues = {
  customerName: string;
  type: Exclude<ProjectDocumentKind, 'PRESUPUESTO'>;
  number: string;
  statusLabel: string;
  createdAt: string;
};

type Props = {
  mode: 'read' | 'edit';
  values: ManualDocumentDrawerValues;
  onChange?: (patch: Partial<ManualDocumentDrawerValues>) => void;
};

const Cell = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border px-4 py-3" style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelBg }}>
    <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: documentManagementTheme.muted }}>
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold" style={{ color: documentManagementTheme.text }}>
      {value || '—'}
    </div>
  </div>
);

export const ManualDocumentDrawerPanel = ({ mode, values, onChange }: Props) => (
  <div className="grid gap-3 md:grid-cols-2">
    {mode === 'edit' && onChange ? (
      <>
        <label className="block rounded-2xl border px-4 py-3" style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelBg }}>
          <span className="block text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: documentManagementTheme.muted }}>
            Cliente
          </span>
          <input
            value={values.customerName}
            onChange={(event) => onChange({ customerName: event.target.value })}
            className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
            style={{ color: documentManagementTheme.text }}
          />
        </label>
        <label className="block rounded-2xl border px-4 py-3" style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelBg }}>
          <span className="block text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: documentManagementTheme.muted }}>
            Tipo
          </span>
          <select
            value={values.type}
            onChange={(event) => onChange({ type: event.target.value as ManualDocumentDrawerValues['type'] })}
            className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
            style={{ color: documentManagementTheme.text }}
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="block rounded-2xl border px-4 py-3" style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelBg }}>
          <span className="block text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: documentManagementTheme.muted }}>
            Número
          </span>
          <input
            value={values.number}
            onChange={(event) => onChange({ number: event.target.value })}
            className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
            style={{ color: documentManagementTheme.text }}
          />
        </label>
        <Cell label="Estado" value={values.statusLabel} />
        <Cell label="Creado" value={values.createdAt} />
      </>
    ) : (
      <>
        <Cell label="Cliente" value={values.customerName} />
        <Cell label="Tipo" value={values.type} />
        <Cell label="Número" value={values.number} />
        <Cell label="Estado" value={values.statusLabel} />
        <Cell label="Creado" value={values.createdAt} />
      </>
    )}
  </div>
);
