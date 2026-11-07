export type ReferenceValue = string | number | boolean;
export type ReferenceOption = { value: string; label: string; image: string | null };
export type ReferenceCondition = { fieldId: string; value: string };
export type ReferenceField = {
  id: string; sourceKey: string; label: string; type: string; options: ReferenceOption[];
  min: number | null; max: number | null; help: string; appearance: string;
  showWhen: ReferenceCondition[]; hideWhen: ReferenceCondition[]; modelIds: string[];
};
export type ReferenceModel = { id: string; name: string; sourceCode: string; image: string | null; url: string | null; overrides: { label: string; options: string[] }[] };
export type ReferenceForm = { id: string; name: string; category: string; image: string | null; models: ReferenceModel[]; fields: ReferenceField[] };
export type ReferenceCatalog = { version: number; source: string; forms: ReferenceForm[]; documents: { id: string; name: string; url: string; sizeBytes: number }[] };
export type MarverSpecification = {
  catalogVersion: 1; formId: string; modelId: string; formName: string; modelName: string;
  attachments?: { fieldId: string; name: string; type: string; mimeType: string; generatedAt: string; contentBase64: string }[];
  values: Record<string, ReferenceValue>;
  answers: { label: string; value: string; fieldId: string }[];
};

export const createSpecification = (form: ReferenceForm): MarverSpecification => ({
  catalogVersion: 1, formId: form.id, formName: form.name, modelId: '', modelName: '', values: {}, answers: [],
});
const normalize = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const isModelField = (field: ReferenceField) => field.label === 'Modelo' || ['mCancelas', 'mWelcome'].includes(field.sourceKey);
export const referenceStage = (field: ReferenceField): number => {
  const key = normalize(field.sourceKey + ' ' + field.label);
  if (/color|acabado|imprimacion|iral/.test(key)) return 2;
  if (/entendido|ancho|alto|altura|holgura|luces|distancia|medida/.test(key)) return 4;
  if (/buzon|tirador|manivela|cerrad|pilar|poste|fotoc|bateria|cremallera|receptor|mando|spray|platina|perfil|remate/.test(key)) return 5;
  if (/apertura|bisagra|lama|motor|anclaje|dintel|marco|hojaprimero|hojaiguales|peatonal/.test(key)) return 3;
  return 5;
};
const conditionMatches = (condition: ReferenceCondition, form: ReferenceForm, spec: MarverSpecification): boolean => {
  const field = form.fields.find(f => f.id === condition.fieldId);
  const value = spec.values[condition.fieldId];
  const expected = normalize(condition.value);
  if (['no', 'ninguno'].includes(expected) && (value === undefined || value === '')) return true;
  if (expected === 'desmarcado') return value !== true;
  if (expected === 'marcado') return value === true;
  const option = field?.options.find(o => o.value === value);
  return normalize(value) === expected || normalize(option?.label) === expected;
};
export const referenceOptions = (field: ReferenceField, form: ReferenceForm, spec: MarverSpecification): ReferenceOption[] => {
  const override = form.models.find(m => m.id === spec.modelId)?.overrides.find(o => o.label === field.label);
  if (!override) return field.options;
  const options = field.options.filter(option => override.options.some(value => normalize(value) === normalize(option.label)));
  return options.length ? options : field.options;
};
export const visibleReferenceFields = (form: ReferenceForm, spec: MarverSpecification): ReferenceField[] => form.fields.filter(field => {
  if (isModelField(field) || field.sourceKey === 'jPuertas') return false;
  if (field.modelIds.length && !field.modelIds.includes(spec.modelId)) return false;
  const groups = new Map<string, ReferenceCondition[]>();
  for (const condition of field.showWhen) groups.set(condition.fieldId, [...(groups.get(condition.fieldId) ?? []), condition]);
  if ([...groups.values()].some(group => !group.some(c => conditionMatches(c, form, spec)))) return false;
  return !field.hideWhen.some(c => conditionMatches(c, form, spec));
});
export const cleanSpecification = (form: ReferenceForm, input: MarverSpecification): MarverSpecification => {
  const spec = { ...input, values: { ...input.values } };
  for (let i = 0; i <= form.fields.length; i++) {
    const fields = visibleReferenceFields(form, spec);
    let changed = false;
    for (const key of Object.keys(spec.values)) {
      const field = fields.find(f => f.id === key);
      const options = field ? referenceOptions(field, form, spec) : [];
      if (!field || (options.length && !options.some(o => o.value === spec.values[key]))) { delete spec.values[key]; changed = true; }
    }
    if (!changed) break;
  }
  spec.attachments = spec.attachments?.filter(attachment => spec.values[attachment.fieldId] === attachment.name);
  spec.answers = visibleReferenceFields(form, spec).flatMap(field => {
    const value = spec.values[field.id];
    if (value === undefined || value === '') return [];
    return [{ fieldId: field.id, label: field.label, value: typeof value === 'boolean' ? value ? 'Sí' : 'No' : referenceOptions(field, form, spec).find(o => o.value === value)?.label ?? String(value) }];
  });
  return spec;
};
export const referenceErrors = (catalog: ReferenceCatalog | null, spec: MarverSpecification, stage?: number): string[] => {
  const form = catalog?.forms.find(f => f.id === spec.formId);
  if (!form) return ['Selecciona una plantilla de referencia válida.'];
  const errors: string[] = [];
  if ((stage === undefined || stage >= 2) && form.models.length && !form.models.some(m => m.id === spec.modelId)) errors.push('Selecciona un modelo de la plantilla.');
  for (const field of visibleReferenceFields(form, spec)) {
    if (stage !== undefined && referenceStage(field) !== stage) continue;
    const value = spec.values[field.id];
    if (field.type !== 'number' || value === undefined || value === '') continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || (field.min !== null && value < field.min) || (field.max !== null && value > field.max)) errors.push(`${field.label}: revisa el rango de captura (${field.min ?? 'sin mínimo'}–${field.max ?? 'sin máximo'}).`);
  }
  return errors;
};
