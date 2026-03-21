import { useEffect, useState } from 'react';
import type { CustomerOption, NewRequestData } from '../models';
import { MODELS } from '../constants';
import { Field, FieldLabel, TextArea, uiColors } from './ui';

export const NewRequestModal = ({
  open,
  onClose,
  onCreate,
  customers,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewRequestData) => void;
  customers: CustomerOption[];
}) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [m2, setM2] = useState(0);
  const [reference, setReference] = useState('');
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setCustomerId('');
      setCustomerName('');
      setModelId(MODELS[0].id);
      setM2(0);
      setReference('');
      setGoogleView(false);
      setNotes('');
    }
  }, [open]);

  const resolvedCustomerName = (() => {
    const match = customers.find(c => c.id === customerId);
    return match?.nombreComercial || match?.razonSocial || customerName;
  })();

  const canCreate = Boolean(resolvedCustomerName) && m2 > 0 && reference.trim().length > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: uiColors.surfaceDark, borderBottom: '1px solid #21262d' }}
        >
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Nueva solicitud
            </h2>
            <p style={{ fontSize: 10, fontWeight: 600, color: uiColors.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              Bandeja de solicitudes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: uiColors.textSubtle }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = uiColors.textSubtle; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Cliente (CRM)</FieldLabel>
              <select
                className="field"
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
                className="field"
                value={modelId}
                onChange={e => setModelId(e.target.value)}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>m² estimados</FieldLabel>
              <Field
                type="number"
                min={0}
                step="0.01"
                value={m2}
                onChange={e => setM2(Number(e.target.value || 0))}
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
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: `1px solid ${uiColors.border}`, background: '#f8f9fb' }}
        >
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canCreate}
            style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}
            onClick={() => onCreate({
              customerName: resolvedCustomerName,
              modelId,
              m2,
              reference: reference.toUpperCase(),
              googleView,
              notes,
            })}
          >
            Crear solicitud
          </button>
        </div>
      </div>
    </div>
  );
};
