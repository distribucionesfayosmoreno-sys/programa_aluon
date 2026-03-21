import React from 'react';
import type { CustomerOption } from '../models';
import { MODELS } from '../constants';
import { Field, FieldLabel, SectionTitle, TextArea } from '../components/ui';

export const RequestSection = ({
  customers,
  customerId,
  modelId,
  m2,
  modelReference,
  googleView,
  notes,
  hasModelRef,
  onCustomerChange,
  onModelChange,
  onM2Change,
  onModelReferenceChange,
  onModelImageChange,
  onGoogleViewChange,
  onNotesChange,
}: {
  customers: CustomerOption[];
  customerId: string;
  modelId: string;
  m2: number;
  modelReference: string;
  googleView: boolean;
  notes: string;
  hasModelRef: boolean;
  onCustomerChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onM2Change: (value: number) => void;
  onModelReferenceChange: (value: string) => void;
  onModelImageChange: (file: File | null) => void;
  onGoogleViewChange: (value: boolean) => void;
  onNotesChange: (value: string) => void;
}) => (
  <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <SectionTitle n="01" label="Solicitud del cliente" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Cliente</FieldLabel>
        <select
          className="field"
          value={customerId}
          onChange={e => onCustomerChange(e.target.value)}
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
        <FieldLabel>Modelo</FieldLabel>
        <select
          className="field"
          value={modelId}
          onChange={e => onModelChange(e.target.value)}
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
          onChange={e => onM2Change(Number(e.target.value || 0))}
        />
      </div>
      <div>
        <FieldLabel>Referencia del modelo</FieldLabel>
        <Field
          placeholder="Código o referencia interna"
          value={modelReference}
          onChange={e => onModelReferenceChange(e.target.value.toUpperCase())}
        />
      </div>
      <div>
        <FieldLabel>Imagen del modelo</FieldLabel>
        <input
          type="file"
          accept="image/*"
          className="field"
          onChange={e => onModelImageChange(e.target.files?.[0] ?? null)}
        />
      </div>
      <div className="flex items-center gap-3 pt-7">
        <input
          type="checkbox"
          checked={googleView}
          onChange={e => onGoogleViewChange(e.target.checked)}
          style={{ accentColor: '#e5534b', width: 16, height: 16 }}
        />
        <span className="text-xs font-semibold uppercase" style={{ color: '#8b949e', letterSpacing: '0.08em' }}>
          Visualización en Google (apoyo en tienda)
        </span>
      </div>
      <div className="md:col-span-2">
        <FieldLabel>Notas del cliente</FieldLabel>
        <TextArea
          placeholder="Observaciones, medidas especiales, acabados..."
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
        />
      </div>
    </div>
    {!hasModelRef && (
      <p className="text-xs font-semibold mt-3" style={{ color: '#dc2626' }}>
        Debe incluir imagen o referencia del modelo.
      </p>
    )}
  </section>
);
