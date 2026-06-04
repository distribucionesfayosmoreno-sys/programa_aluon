import type { DocumentDrawerMetaGridProps } from './DocumentDrawerMetaGrid.types';
import { documentManagementTheme } from '../documentManagementTheme';

const Card = ({ label, value }: { label: string; value: string }) => (
  <div className="col-span-3">
    <div className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: documentManagementTheme.muted }}>
      {label}
    </div>
    <div
      className="w-full rounded-md border px-2 py-1.5 text-xs font-semibold truncate"
      style={{
        borderColor: documentManagementTheme.border,
        background: documentManagementTheme.panelBg,
        color: documentManagementTheme.text,
        boxShadow: documentManagementTheme.shadowSoft,
      }}
      title={value}
    >
      {value || '—'}
    </div>
  </div>
);

const InputCard = ({
  label,
  value,
    onChange,
    placeholder,
  }: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) => (
  <div className="col-span-3">
    <div className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: documentManagementTheme.muted }}>
      {label}
    </div>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border px-2 py-1.5 text-xs font-semibold"
      style={{
        borderColor: documentManagementTheme.border,
        background: documentManagementTheme.panelBg,
        color: documentManagementTheme.text,
        boxShadow: documentManagementTheme.shadowSoft,
      }}
    />
  </div>
);

export const DocumentDrawerMetaGrid = ({ mode, values, onChange }: DocumentDrawerMetaGridProps) => (
  <div
    className="grid grid-cols-12 gap-2 mb-2 p-3 border rounded-2xl"
    style={{
      borderColor: '#dbe4f0',
      background: documentManagementTheme.panelSoftBg,
      boxShadow: documentManagementTheme.shadowSoft,
    }}
  >
    {mode === 'edit' && onChange ? (
      <>
        <InputCard label="Nombre comercial" value={values.nombreComercial} onChange={(next) => onChange({ nombreComercial: next })} />
        <InputCard label="Email" value={values.contactEmail} onChange={(next) => onChange({ contactEmail: next })} />
        <InputCard label="Teléfono" value={values.telefono} onChange={(next) => onChange({ telefono: next })} />
        <InputCard label="Dirección entrega" value={values.direccionEntrega} onChange={(next) => onChange({ direccionEntrega: next })} />

        <InputCard label="Dirección" value={values.direccion} onChange={(next) => onChange({ direccion: next })} />
        <InputCard label="CP" value={values.cp} onChange={(next) => onChange({ cp: next })} />
        <InputCard label="Población" value={values.poblacion} onChange={(next) => onChange({ poblacion: next })} />
        <InputCard label="Provincia" value={values.provincia} onChange={(next) => onChange({ provincia: next })} />
      </>
    ) : (
      <>
        <Card label="Nombre comercial" value={values.nombreComercial} />
        <Card label="Email" value={values.contactEmail} />
        <Card label="Teléfono" value={values.telefono} />
        <Card label="Dirección entrega" value={values.direccionEntrega} />

        <Card label="Dirección" value={values.direccion} />
        <Card label="CP" value={values.cp} />
        <Card label="Población" value={values.poblacion} />
        <Card label="Provincia" value={values.provincia} />
      </>
    )}
  </div>
);
