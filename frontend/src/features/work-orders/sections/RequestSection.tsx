import type { CustomerOption } from '../models';
import { MODELS } from '../constants';
import { cardStyle, Field, FieldLabel, SectionTitle, TextArea, uiColors } from '../components/ui';

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
  highlightCustomer,
  highlightM2,
  highlightModelRef,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
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
  highlightCustomer?: boolean;
  highlightM2?: boolean;
  highlightModelRef?: boolean;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
}) => (
  <section className="p-6 rounded-2xl" style={cardStyle}>
    <SectionTitle n="01" label="Solicitud del cliente" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Cliente</FieldLabel>
        <select
          className="field"
          value={customerId}
          onChange={e => onCustomerChange(e.target.value)}
          style={highlightCustomer ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 2px var(--danger-bg)' } : undefined}
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
          style={highlightM2 ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 2px var(--danger-bg)' } : undefined}
        />
      </div>
      <div>
        <FieldLabel>Referencia del modelo</FieldLabel>
        <Field
          placeholder="Código o referencia interna"
          value={modelReference}
          onChange={e => onModelReferenceChange(e.target.value.toUpperCase())}
          style={highlightModelRef ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 2px var(--danger-bg)' } : undefined}
        />
      </div>
      <div>
        <FieldLabel>Imagen del modelo</FieldLabel>
        <input
          type="file"
          accept="image/*"
          className="field"
          onChange={e => onModelImageChange(e.target.files?.[0] ?? null)}
          style={highlightModelRef ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 2px var(--danger-bg)' } : undefined}
        />
      </div>
      <div className="flex items-center gap-3 pt-7">
        <input
          type="checkbox"
          checked={googleView}
          onChange={e => onGoogleViewChange(e.target.checked)}
          style={{ accentColor: uiColors.accent, width: 16, height: 16 }}
        />
        <span className="text-xs font-semibold uppercase" style={{ color: uiColors.textSubtle, letterSpacing: '0.08em' }}>
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
      <p className="text-xs font-semibold mt-3" style={{ color: uiColors.danger }}>
        Debe incluir imagen o referencia del modelo.
      </p>
    )}
    {onAdvanceStep && (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onAdvanceStep}
          disabled={!canAdvanceStep}
          style={{ opacity: canAdvanceStep ? 1 : 0.5, cursor: canAdvanceStep ? 'pointer' : 'not-allowed' }}
          title={advanceHint || undefined}
        >
          <span className="text-base">➡️</span>
          Avanzar etapa{nextStepLabel ? ` · ${nextStepLabel}` : ''}
        </button>
        {advanceHint && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: uiColors.textGhost }}>
            {advanceHint}
          </span>
        )}
      </div>
    )}
  </section>
);
