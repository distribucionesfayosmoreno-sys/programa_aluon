import type { DoorType } from './models';
import type { FormState, UpdateField } from './CutlistPage.types';
import { BOOLEAN_OPTIONS } from './cutlistConstants';

type CutlistOptionsSectionProps = {
  form: FormState;
  updateField: UpdateField;
  locked: boolean;
  selectedDoorType: DoorType | null;
  automationReinforcementLocked: boolean;
};

export const CutlistOptionsSection = ({
  form,
  updateField,
  locked,
  selectedDoorType,
  automationReinforcementLocked,
}: CutlistOptionsSectionProps) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black text-slate-900">Medidas y opciones</h2>
        <p className="text-xs text-slate-500">Completa los datos específicos del tipo seleccionado.</p>
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Paso 2</div>
    </div>
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div>
        <label className="field-label">Altura total (mm)</label>
        <input
          className="field"
          value={form.heightMm}
          onChange={event => updateField('heightMm', event.target.value)}
          disabled={locked}
          placeholder="Ej: 1800"
        />
      </div>
      <div>
        <label className="field-label">Anchura total (mm)</label>
        <input
          className="field"
          value={form.widthMm}
          onChange={event => updateField('widthMm', event.target.value)}
          disabled={locked}
          placeholder="Ej: 1200"
        />
      </div>

      {(selectedDoorType === 'PEATONAL' || selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
        <>
          <div>
            <label className="field-label">Holgura con el suelo (mm)</label>
            <input
              className="field"
              value={form.groundClearanceMm}
              onChange={event => updateField('groundClearanceMm', event.target.value)}
              disabled={locked}
              placeholder="Ej: 18"
            />
          </div>
          <div>
            <label className="field-label">Bisagras</label>
            <select
              className="field"
              value={form.hingesSide}
              onChange={event => updateField('hingesSide', event.target.value as FormState['hingesSide'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="LEFT">Izquierda</option>
              <option value="RIGHT">Derecha</option>
            </select>
          </div>
        </>
      )}

      {selectedDoorType === 'PEATONAL' && (
        <>
          <div>
            <label className="field-label">Portero automático</label>
            <select
              className="field"
              value={form.porterAutomatic}
              onChange={event => updateField('porterAutomatic', event.target.value as FormState['porterAutomatic'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Larguero</label>
            <select
              className="field"
              value={form.largueroMm}
              onChange={event => updateField('largueroMm', event.target.value as FormState['largueroMm'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="50">50mm</option>
              <option value="80">80mm</option>
            </select>
          </div>
          <div>
            <label className="field-label">Marco superior</label>
            <select
              className="field"
              value={form.topFrame}
              onChange={event => updateField('topFrame', event.target.value as FormState['topFrame'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {(selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
        <>
          <div>
            <label className="field-label">Incluir automatización</label>
            <select
              className="field"
              value={form.automationIncluded}
              onChange={event => updateField('automationIncluded', event.target.value as FormState['automationIncluded'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Refuerzo automatización</label>
            <select
              className="field"
              value={form.automationReinforcement}
              onChange={event => updateField('automationReinforcement', event.target.value as FormState['automationReinforcement'])}
              disabled={locked || automationReinforcementLocked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Larguero</label>
            <select
              className="field"
              value={form.largueroMm}
              onChange={event => updateField('largueroMm', event.target.value as FormState['largueroMm'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="50">50mm</option>
              <option value="80">80mm</option>
            </select>
          </div>
          <div>
            <label className="field-label">Marco superior</label>
            <select
              className="field"
              value={form.topFrame}
              onChange={event => updateField('topFrame', event.target.value as FormState['topFrame'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {selectedDoorType === 'CORREDERA' && (
        <>
          <div>
            <label className="field-label">Apertura</label>
            <select
              className="field"
              value={form.openingSide}
              onChange={event => updateField('openingSide', event.target.value as FormState['openingSide'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="LEFT">Izquierda</option>
              <option value="RIGHT">Derecha</option>
            </select>
          </div>
          <div>
            <label className="field-label">Carril</label>
            <select
              className="field"
              value={form.railType}
              onChange={event => updateField('railType', event.target.value as FormState['railType'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="CARRIL_16">16mm</option>
              <option value="CARRIL_20">20mm</option>
            </select>
          </div>
          <div>
            <label className="field-label">Incluir automatización</label>
            <select
              className="field"
              value={form.automationIncluded}
              onChange={event => updateField('automationIncluded', event.target.value as FormState['automationIncluded'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Refuerzo automatización</label>
            <select
              className="field"
              value={form.automationReinforcement}
              onChange={event => updateField('automationReinforcement', event.target.value as FormState['automationReinforcement'])}
              disabled={locked || automationReinforcementLocked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Montaje</label>
            <select
              className="field"
              value={form.mountingType}
              onChange={event => updateField('mountingType', event.target.value as FormState['mountingType'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              <option value="A">Montaje A</option>
              <option value="B">Montaje B</option>
            </select>
          </div>
          <div>
            <label className="field-label">Cola</label>
            <select
              className="field"
              value={form.tail}
              onChange={event => updateField('tail', event.target.value as FormState['tail'])}
              disabled={locked}
            >
              <option value="">Selecciona</option>
              {BOOLEAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
    <div className="mt-4 text-xs text-slate-500">
      Nota: todas las medidas están en milímetros (mm).
    </div>
  </section>
);
