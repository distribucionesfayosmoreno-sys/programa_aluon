import { useEffect, useState } from 'react';
import type { CustomerOption, NewRequestData } from '../models';
import { MODELS } from '../constants';
import { Field, FieldLabel, TextArea, uiColors } from './ui';
import AppDialog from '../../../components/feedback/AppDialog';

export const NewRequestModal = ({
  open,
  onClose,
  onCreate,
  customers,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewRequestData) => Promise<void>;
  customers: CustomerOption[];
}) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [reference, setReference] = useState('');
  const [color, setColor] = useState('');
  const [installerName, setInstallerName] = useState('');
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCustomerId('');
      setCustomerName('');
      setModelId(MODELS[0].id);
      setWidthMm(0);
      setHeightMm(0);
      setReference('');
      setColor('');
      setInstallerName('');
      setGoogleView(false);
      setNotes('');
      setSaving(false);
      setError('');
    }
  }, [open]);

  const resolvedCustomerName = (() => {
    const match = customers.find(c => c.id === customerId);
    return match?.nombreComercial || match?.razonSocial || customerName;
  })();

  const m2 = Math.round(((widthMm * heightMm) / 1_000_000) * 10) / 10;
  const canCreate = Boolean(resolvedCustomerName)
    && reference.trim().length > 0
    && widthMm > 0
    && heightMm > 0
    && !saving;

  if (!open) return null;

  return (
    <AppDialog
      open={open}
      title="Nueva solicitud"
      subtitle="Bandeja de solicitudes"
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
      actions={
        <>
          <button type="button" onClick={onClose} className="btn-ghost" disabled={saving}>Cancelar</button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canCreate}
            style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}
            onClick={async () => {
              setSaving(true);
              setError('');
              try {
                await onCreate({
                  customerId: customerId || undefined,
                  customerName: resolvedCustomerName,
                  modelId,
                  widthMm,
                  heightMm,
                  reference: reference.toUpperCase(),
                  color: color.trim() || undefined,
                  installerName: installerName.trim() || undefined,
                  googleView,
                  notes,
                });
              } catch (err) {
                const message = err instanceof Error ? err.message : 'No se pudo crear la solicitud.';
                setError(message);
                setSaving(false);
              }
            }}
          >
            {saving ? 'Creando…' : 'Crear solicitud'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Cliente (CRM)</FieldLabel>
          <select
            className="field w-full"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
          >
            <option value="">Selecciona un cliente</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombreComercial || c.razonSocial || c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Nombre cliente (manual)</FieldLabel>
          <Field
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Si no está en CRM"
          />
        </div>
        <div>
          <FieldLabel>Modelo</FieldLabel>
          <select
            className="field w-full"
            value={modelId}
            onChange={e => setModelId(e.target.value)}
          >
            {MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Medidas (mm)</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <Field
              type="number"
              min={0}
              step="1"
              value={widthMm}
              onChange={e => setWidthMm(Number(e.target.value || 0))}
              placeholder="Ancho"
            />
            <Field
              type="number"
              min={0}
              step="1"
              value={heightMm}
              onChange={e => setHeightMm(Number(e.target.value || 0))}
              placeholder="Alto"
            />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase" style={{ color: uiColors.textSubtle, letterSpacing: '0.08em' }}>
            m² calculados: {m2 > 0 ? m2.toFixed(1) : '—'}
          </p>
        </div>
        <div>
          <FieldLabel>Color (opcional)</FieldLabel>
          <Field
            value={color}
            onChange={e => setColor(e.target.value)}
            placeholder="Ej: RAL 7016, Inox..."
          />
        </div>
        <div>
          <FieldLabel>Instalador (opcional)</FieldLabel>
          <Field
            value={installerName}
            onChange={e => setInstallerName(e.target.value)}
            placeholder="Nombre del instalador"
          />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>Referencia del modelo</FieldLabel>
          <Field
            value={reference}
            onChange={e => setReference(e.target.value)}
            placeholder="Código o referencia interna"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={googleView}
            onChange={e => setGoogleView(e.target.checked)}
            style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
          />
          <span className="text-xs font-semibold uppercase" style={{ color: uiColors.textSubtle, letterSpacing: '0.08em' }}>
            Visualización en Google (apoyo en tienda)
          </span>
        </div>
        <div className="md:col-span-2">
          <FieldLabel>Notas</FieldLabel>
          <TextArea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Observaciones, medidas especiales, acabados..."
          />
        </div>
        {error && (
          <div className="md:col-span-2 rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' }}>
            {error}
          </div>
        )}
      </div>
    </AppDialog>
  );
};
