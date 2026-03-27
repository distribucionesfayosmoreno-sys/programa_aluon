import type { CutlistResponse } from './models';
import type { CustomerSummary } from '../../services/customersApi';
import type { FormState, UpdateField } from './CutlistPage.types';
import { DOOR_TYPES, MODEL_OPTIONS } from './cutlistConstants';

type CutlistGeneralSectionProps = {
  form: FormState;
  updateField: UpdateField;
  locked: boolean;
  customers: CustomerSummary[];
  customersLoading: boolean;
  customersError: string;
  error: string;
  submitting: boolean;
  cutlist: CutlistResponse | null;
  onSubmit: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onUnlock: () => void;
  onReset: () => void;
};

export const CutlistGeneralSection = ({
  form,
  updateField,
  locked,
  customers,
  customersLoading,
  customersError,
  error,
  submitting,
  cutlist,
  onSubmit,
  onPrint,
  onExportPdf,
  onExportCsv,
  onUnlock,
  onReset,
}: CutlistGeneralSectionProps) => (
  <div className="space-y-6">
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Datos generales</h2>
          <p className="text-xs text-slate-500">Información base del presupuesto y acabado.</p>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Paso 1</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="field-label">Distribuidor (cliente)</label>
          <select
            className="field"
            value={form.customerId}
            onChange={event => updateField('customerId', event.target.value)}
            disabled={locked || customersLoading}
          >
            <option value="">
              {customersLoading ? 'Cargando clientes...' : 'Selecciona un cliente'}
            </option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.nombreComercial}
              </option>
            ))}
          </select>
          {customersError && (
            <div className="mt-2 text-xs font-semibold text-rose-600">{customersError}</div>
          )}
        </div>
        <div>
          <label className="field-label">Nº Presupuesto</label>
          <div className="field bg-slate-50 text-slate-500">
            Autogenerado al guardar
          </div>
        </div>
        <div>
          <label className="field-label">Fecha</label>
          <input
            type="date"
            className="field"
            value={form.budgetDate}
            onChange={event => updateField('budgetDate', event.target.value)}
            disabled={locked}
          />
        </div>
        <div>
          <label className="field-label">Color</label>
          <input
            className="field"
            value={form.color}
            onChange={event => updateField('color', event.target.value)}
            disabled={locked}
            placeholder="RAL / acabado"
          />
        </div>
        <div>
          <label className="field-label">Modelo</label>
          <select
            className="field"
            value={form.model}
            onChange={event => updateField('model', event.target.value as FormState['model'])}
            disabled={locked}
          >
            <option value="">Selecciona un modelo</option>
            {MODEL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Tipo de puerta</label>
          <select
            className="field"
            value={form.doorType}
            onChange={event => updateField('doorType', event.target.value as FormState['doorType'])}
            disabled={locked}
          >
            <option value="">Selecciona un tipo</option>
            {DOOR_TYPES.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Nombre instalador (opcional)</label>
          <input
            className="field"
            value={form.installerName}
            onChange={event => updateField('installerName', event.target.value)}
            disabled={locked}
            placeholder="Nombre de instalador"
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Observaciones</label>
          <textarea
            className="field min-h-[96px]"
            value={form.notes}
            onChange={event => updateField('notes', event.target.value)}
            disabled={locked}
            placeholder="Notas adicionales"
          />
        </div>
      </div>
    </section>

    {error && (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-semibold">
        {error}
      </div>
    )}

    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Generando...' : 'Generar despiece'}
        </button>
        <button className="btn-ghost" onClick={onPrint} disabled={!cutlist}>
          Imprimir
        </button>
        <button className="btn-ghost" onClick={onExportPdf} disabled={!cutlist}>
          Exportar PDF
        </button>
        <button className="btn-ghost" onClick={onExportCsv} disabled={!cutlist}>
          Exportar CSV
        </button>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="btn-ghost" onClick={onUnlock} disabled={!locked}>
          Editar
        </button>
        <button className="btn-ghost" onClick={onReset}>
          Reiniciar
        </button>
      </div>
    </div>
  </div>
);
