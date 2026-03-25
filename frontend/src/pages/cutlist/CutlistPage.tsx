import { useEffect, useMemo, useState } from 'react';
import type {
  CutlistRequest,
  CutlistResponse,
  DoorModel,
  DoorType,
  HingesSide,
  MountingType,
  OpeningSide,
  RailType,
} from './models';
import { generateCutlist } from '../../services/cutlistApi';

const MODEL_OPTIONS: Array<{ value: DoorModel; label: string; image: string }> = [
  { value: 'PREMIUM', label: 'ALUON Premium', image: '/legacy/aluon/images/aluonPremium.jpg' },
  { value: 'CLASSIC', label: 'ALUON Classic', image: '/legacy/aluon/images/aluonClassic.jpg' },
  { value: 'INOX', label: 'ALUON Inox', image: '/legacy/aluon/images/aluonInox.jpg' },
  { value: 'VENECIANA', label: 'ALUON Veneciana', image: '/legacy/aluon/images/aluonVeneciana.jpg' },
];

const DOOR_TYPES: Array<{ value: DoorType; label: string }> = [
  { value: 'PEATONAL', label: 'Puerta peatonal' },
  { value: 'ABATIBLE_UNA', label: 'Puerta abatible una hoja' },
  { value: 'ABATIBLE_DOS', label: 'Puerta abatible dos hojas' },
  { value: 'CORREDERA', label: 'Puerta corredera' },
  { value: 'VALLA', label: 'Valla' },
];

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

type FormState = {
  distributor: string;
  budgetNumber: string;
  budgetDate: string;
  model: '' | DoorModel;
  doorType: '' | DoorType;
  color: string;
  installerName: string;
  notes: string;
  widthMm: string;
  heightMm: string;
  groundClearanceMm: string;
  largueroMm: '' | '50' | '80';
  topFrame: '' | 'true' | 'false';
  hingesSide: '' | HingesSide;
  porterAutomatic: '' | 'true' | 'false';
  automationIncluded: '' | 'true' | 'false';
  automationReinforcement: '' | 'true' | 'false';
  openingSide: '' | OpeningSide;
  railType: '' | RailType;
  mountingType: '' | MountingType;
  tail: '' | 'true' | 'false';
};

const emptyForm: FormState = {
  distributor: '',
  budgetNumber: '',
  budgetDate: '',
  model: '',
  doorType: '',
  color: '',
  installerName: '',
  notes: '',
  widthMm: '',
  heightMm: '',
  groundClearanceMm: '',
  largueroMm: '',
  topFrame: '',
  hingesSide: '',
  porterAutomatic: '',
  automationIncluded: '',
  automationReinforcement: '',
  openingSide: '',
  railType: '',
  mountingType: '',
  tail: '',
};

const parseBoolean = (value: '' | 'true' | 'false') => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

const toNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-ES');
};

const formatModel = (value?: DoorModel | null) => {
  if (!value) return '-';
  return MODEL_OPTIONS.find(option => option.value === value)?.label ?? value;
};

const formatDoorType = (value?: DoorType | null) => {
  if (!value) return '-';
  return DOOR_TYPES.find(option => option.value === value)?.label ?? value;
};

const CutlistPage = () => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cutlist, setCutlist] = useState<CutlistResponse | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);

  const selectedModel = form.model || null;
  const selectedDoorType = form.doorType || null;

  const previewImage = useMemo(() => {
    const match = MODEL_OPTIONS.find(option => option.value === selectedModel);
    return match?.image ?? '/legacy/aluon/images/banner.jpg';
  }, [selectedModel]);

  const automationReinforcementLocked = form.automationIncluded === 'true';

  useEffect(() => {
    if (automationReinforcementLocked) {
      setForm(prev => ({ ...prev, automationReinforcement: 'true' }));
    }
  }, [automationReinforcementLocked]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const requiredString = (value: string, label: string) => {
      if (!value.trim()) throw new Error(`El campo "${label}" es obligatorio.`);
    };

    const requiredSelect = (value: string, label: string) => {
      if (!value) throw new Error(`Selecciona una opción para "${label}".`);
    };

    const requiredNumber = (value: string, label: string, allowZero = false) => {
      const parsed = toNumber(value);
      if (parsed === null) throw new Error(`Introduce un valor válido para "${label}".`);
      if (!allowZero && parsed <= 0) throw new Error(`"${label}" debe ser mayor que 0.`);
      if (allowZero && parsed < 0) throw new Error(`"${label}" no puede ser negativo.`);
    };

    requiredString(form.distributor, 'Distribuidor');
    requiredString(form.budgetNumber, 'Nº presupuesto');
    requiredString(form.budgetDate, 'Fecha');
    requiredSelect(form.model, 'Modelo');
    requiredSelect(form.doorType, 'Tipo de puerta');
    requiredString(form.color, 'Color');

    if (selectedDoorType === 'PEATONAL') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.porterAutomatic, 'Portero automático');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'CORREDERA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredSelect(form.openingSide, 'Apertura');
      requiredSelect(form.railType, 'Carril');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.mountingType, 'Montaje');
      requiredSelect(form.tail, 'Cola');
    }

    if (selectedDoorType === 'VALLA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
    }
  };

  const buildRequest = (): CutlistRequest => {
    const width = toNumber(form.widthMm);
    const height = toNumber(form.heightMm);
    if (width === null || height === null) {
      throw new Error('Medidas incompletas.');
    }

    return {
      distributor: form.distributor.trim(),
      budgetNumber: form.budgetNumber.trim(),
      budgetDate: form.budgetDate,
      color: form.color.trim(),
      installerName: form.installerName.trim() || undefined,
      doorType: form.doorType as DoorType,
      model: form.model as DoorModel,
      widthMm: Math.round(width),
      heightMm: Math.round(height),
      groundClearanceMm: toNumber(form.groundClearanceMm),
      largueroMm: form.largueroMm ? Number(form.largueroMm) : null,
      topFrame: parseBoolean(form.topFrame),
      hingesSide: form.hingesSide || null,
      porterAutomatic: parseBoolean(form.porterAutomatic),
      automationIncluded: parseBoolean(form.automationIncluded),
      automationReinforcement: parseBoolean(form.automationReinforcement),
      openingSide: form.openingSide || null,
      railType: form.railType || null,
      mountingType: form.mountingType || null,
      tail: parseBoolean(form.tail),
      notes: form.notes.trim() || null,
    };
  };

  const onSubmit = async () => {
    setError('');
    try {
      validate();
      const payload = buildRequest();
      setSubmitting(true);
      const response = await generateCutlist(payload);
      setCutlist(response);
      setLocked(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Revisa los datos del formulario.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setForm(emptyForm);
    setCutlist(null);
    setLocked(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(229,83,75,0.12), transparent 55%)' }} />
        <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Despiece Inteligente
            </div>
            <h1 className="text-3xl font-black text-slate-900">Calculadora de Despiece ALUON</h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Moderniza el despiece con un flujo guiado, validaciones fuertes y conexión directa con Spring Boot.
              Los resultados se generan con la misma lógica del motor de producción.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {DOOR_TYPES.map(type => (
                <div
                  key={type.value}
                  className={`rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${selectedDoorType === type.value ? 'border-transparent' : 'border-slate-200'}`}
                  style={selectedDoorType === type.value ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 12px 30px var(--accent-shadow-light)' } : { background: '#fff', color: '#94a3b8' }}
                >
                  {type.label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
            <img src={previewImage} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/10 to-transparent" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Modelo Seleccionado</div>
                <div className="text-2xl font-black text-white mt-2">{formatModel(selectedModel)}</div>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3 text-xs text-white">
                {selectedDoorType ? `Configuración activa: ${formatDoorType(selectedDoorType)}` : 'Selecciona un tipo de puerta para empezar.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
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
                <label className="field-label">Distribuidor</label>
                <input
                  className="field"
                  value={form.distributor}
                  onChange={event => updateField('distributor', event.target.value)}
                  disabled={locked}
                  placeholder="Distribuidor"
                />
              </div>
              <div>
                <label className="field-label">Nº Presupuesto</label>
                <input
                  className="field"
                  value={form.budgetNumber}
                  onChange={event => updateField('budgetNumber', event.target.value)}
                  disabled={locked}
                  placeholder="Presupuesto"
                />
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

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Generando...' : 'Generar despiece'}
            </button>
            <button className="btn-ghost" onClick={() => setLocked(false)} disabled={!locked}>
              Editar
            </button>
            <button className="btn-ghost" onClick={resetAll}>
              Reiniciar
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-black text-slate-900">Resumen</h3>
            <div className="grid gap-3 mt-4 text-xs text-slate-500">
              <div className="flex justify-between">
                <span className="font-semibold">Modelo</span>
                <span>{formatModel(selectedModel)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tipo</span>
                <span>{formatDoorType(selectedDoorType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Fecha</span>
                <span>{formatDate(form.budgetDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Distribuidor</span>
                <span>{form.distributor || '-'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-black text-slate-900">Resultado</h3>
            <p className="text-xs text-slate-500 mt-2">El motor de cálculo de producción generará el desglose final.</p>
            <div className="mt-4">
              {cutlist ? (
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="font-semibold text-slate-500">Despiece #{cutlist.id.slice(0, 8)}</div>
                    <div className="text-slate-700 font-bold mt-1">{cutlist.items.length} elementos</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="text-slate-400 uppercase font-bold tracking-widest">Creado</div>
                    <div className="text-slate-700 font-semibold mt-1">{formatDate(cutlist.createdAt)}</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
                  Completa los datos y genera el despiece.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Desglose de piezas</h2>
            <p className="text-xs text-slate-500">Salida directa del calculador de producción.</p>
          </div>
          {cutlist && (
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{cutlist.items.length} filas</div>
          )}
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400 border-b">
              <tr>
                <th className="py-3 text-left">Descripción</th>
                <th className="py-3 text-left">Unidades</th>
                <th className="py-3 text-left">Medida de corte</th>
              </tr>
            </thead>
            <tbody>
              {cutlist?.items.map((item, index) => (
                <tr key={`${item.description}-${index}`} className="border-b last:border-none">
                  <td className="py-3 text-slate-900 font-semibold">{item.description}</td>
                  <td className="py-3 text-slate-600">{item.units}</td>
                  <td className="py-3 text-slate-600">{item.cutMeasure}</td>
                </tr>
              ))}
              {!cutlist && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                    Aún no hay datos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CutlistPage;
