import { useId, useState } from 'react';
import { cleanSpecification, createSpecification, referenceOptions, referenceStage, visibleReferenceFields, type MarverSpecification, type ReferenceCatalog, type ReferenceField, type ReferenceForm, type ReferenceValue } from './marverReference';

export const MarverTemplateSelector = ({ catalog, spec, onChange }: { catalog: ReferenceCatalog; spec: MarverSpecification; onChange: (spec: MarverSpecification) => void }) => {
  const id = useId();
  return <div className="space-y-4 mt-5">
    <label htmlFor={id} className="field-label">Plantilla Marver</label>
    <select id={id} className="field" value={spec.formId} onChange={e => { const form = catalog.forms.find(f => f.id === e.target.value); if (form) onChange(createSpecification(form)); }}>
      <option value="">Seleccionar plantilla</option>
      {[...new Set(catalog.forms.map(f => f.category))].map(category => <optgroup key={category} label={category}>{catalog.forms.filter(f => f.category === category).map(form => <option key={form.id} value={form.id}>{form.name}</option>)}</optgroup>)}
    </select>
    <p className="text-sm text-slate-600">Escoge la plantilla para ver sus modelos y opciones. Los datos se guardan como solicitud pendiente de revisión técnica y valoración.</p>
  </div>;
};

export const ReferenceInput = ({ field, form, spec, onChange }: { field: ReferenceField; form: ReferenceForm; spec: MarverSpecification; onChange: (spec: MarverSpecification) => void }) => {
  const id = useId();
  const [fileError, setFileError] = useState('');
  const value = spec.values[field.id];
  const options = referenceOptions(field, form, spec);
  const update = (value: ReferenceValue) => onChange(cleanSpecification(form, { ...spec, values: { ...spec.values, [field.id]: value } }));
  if (field.type === 'file') return <div className="col-span-full">
    <label htmlFor={id} className="field-label">{field.label}</label>
    <input id={id} className="field mt-1" type="file" accept="application/pdf,image/*" onChange={async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { setFileError('El adjunto debe ocupar como máximo 5 MB.'); return; }
      const existingBytes = (spec.attachments ?? []).filter(a => a.fieldId !== field.id).reduce((total, a) => total + Math.ceil((a.contentBase64.split(',')[1]?.length ?? 0) * 3 / 4), 0);
      if (existingBytes + file.size > 8 * 1024 * 1024) { setFileError('El conjunto de adjuntos debe ocupar como máximo 8 MB.'); return; }
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) { setFileError('Selecciona un PDF o una imagen.'); return; }
      try {
        const contentBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No se pudo leer el archivo.')); reader.readAsDataURL(file);
        });
        const attachments = [...(spec.attachments ?? []).filter(a => a.fieldId !== field.id), { fieldId: field.id, name: file.name, type: 'REFERENCE_ATTACHMENT', mimeType: file.type, generatedAt: new Date().toISOString(), contentBase64 }];
        onChange(cleanSpecification(form, { ...spec, values: { ...spec.values, [field.id]: file.name }, attachments })); setFileError('');
      } catch { setFileError('No se pudo leer el adjunto.'); }
    }} />
    {value && <p className="text-xs mt-1">Adjunto: {String(value)} <button type="button" className="underline ml-2" onClick={() => onChange(cleanSpecification(form, { ...spec, values: { ...spec.values, [field.id]: '' }, attachments: spec.attachments?.filter(a => a.fieldId !== field.id) }))}>Quitar</button></p>}
    {fileError && <p role="alert" className="text-xs text-red-700">{fileError}</p>}
  </div>;
  if (field.type === 'checkbox') return <label className="flex gap-3 items-center text-sm"><input type="checkbox" checked={value === true} onChange={e => update(e.target.checked)} />{field.label}</label>;
  if (options.some(o => o.image)) return <fieldset className="space-y-3 col-span-full"><legend className="field-label">{field.label}</legend>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">{options.map(option => <button key={option.value} type="button" aria-label={option.label} aria-pressed={value === option.value} onClick={() => update(option.value)} className={`min-w-0 rounded-xl border-2 p-2 text-xs text-left ${value === option.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}>
      {option.image && <img src={option.image} alt={option.label} loading="lazy" className="h-20 w-full object-contain rounded-lg mb-2" />}<span className="break-words font-semibold">{option.label}</span>
    </button>)}</div>
  </fieldset>;
  return <div className={field.type === 'textarea' ? 'col-span-full' : ''}>
    <label htmlFor={id} className="field-label">{field.label}</label>
    {options.length ? <select id={id} className="field mt-1" value={value === undefined ? '' : String(value)} onChange={e => update(e.target.value)}><option value="">Seleccionar opción</option>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      : field.type === 'textarea' ? <textarea id={id} className="field mt-1" value={String(value ?? '')} onChange={e => update(e.target.value)} />
      : <input id={id} className="field mt-1" type={field.type === 'number' ? 'number' : 'text'} min={field.min ?? undefined} max={field.max ?? undefined} step="any" value={typeof value === 'boolean' ? '' : value ?? ''} onChange={e => update(field.type === 'number' && e.target.value !== '' ? Number(e.target.value) : e.target.value)} />}
    {field.type === 'number' && (field.min !== null || field.max !== null) && <p className="text-xs text-slate-500 mt-1">Rango de captura del portal: {field.min ?? 'sin mínimo'}–{field.max ?? 'sin máximo'}. Confirmar viabilidad técnica.</p>}
    {!options.length && field.help && field.type !== 'number' && <p className="text-xs text-slate-500 mt-1">{field.help}</p>}
  </div>;
};

export const MarverReferenceFields = ({ catalog, spec, stage, onChange }: { catalog: ReferenceCatalog; spec: MarverSpecification; stage: number; onChange: (spec: MarverSpecification) => void }) => {
  const form = catalog.forms.find(f => f.id === spec.formId);
  if (!form) return <p role="alert">La plantilla no está disponible.</p>;
  const fields = visibleReferenceFields(form, spec).filter(f => referenceStage(f) === stage);
  return <div className="space-y-6">
    <div><p className="text-xs text-blue-700 font-bold uppercase">Catálogo de referencia Marver</p><h2 className="text-xl font-black mt-1">{form.name}</h2></div>
    {stage === 2 && form.models.length > 0 && <fieldset><legend className="text-sm font-bold mb-3">Modelo Marver</legend>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">{form.models.map(model => <div key={model.id} className={`min-w-0 rounded-xl border-2 overflow-hidden ${spec.modelId === model.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}>
        <button type="button" aria-label={model.name} aria-pressed={spec.modelId === model.id} onClick={() => onChange(cleanSpecification(form, { ...spec, modelId: model.id, modelName: model.name }))} className="w-full p-3 text-left">
          {model.image ? <img src={model.image} alt={model.name} loading="lazy" className="h-28 w-full object-cover rounded-lg mb-3" /> : <span className="block h-28 p-4 text-xs text-slate-500">Imagen no disponible</span>}
          <span className="block text-sm font-bold">{model.name}</span>
        </button>
        {model.url && <a href={model.url} target="_blank" rel="noreferrer" className="block px-3 pb-3 text-xs text-blue-700 underline">Ver modelo</a>}
      </div>)}</div>
    </fieldset>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{fields.filter(field => !field.appearance.startsWith('Adicional')).map(field => <ReferenceInput key={field.id} field={field} form={form} spec={spec} onChange={onChange} />)}</div>
    {fields.some(field => field.appearance.startsWith('Adicional')) && <section className="rounded-xl border p-4" aria-label="Opciones adicionales de la plantilla"><h3 className="font-bold">Opciones adicionales de la plantilla</h3><p className="mt-1 text-sm text-slate-600">Confirma su aplicabilidad en la revisión técnica.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">{fields.filter(field => field.appearance.startsWith('Adicional')).map(field => <ReferenceInput key={field.id} field={field} form={form} spec={spec} onChange={onChange} />)}</div></section>}
    {!fields.length && stage !== 2 && <p className="text-sm text-slate-500">Esta plantilla no tiene más opciones en este paso. Puedes continuar.</p>}
    {stage === 5 && <details className="rounded-xl border p-4"><summary className="font-bold cursor-pointer">Catálogos y manuales de instalación (10 PDF)</summary><ul className="space-y-2 mt-3">{catalog.documents.map(doc => <li key={doc.id}><a className="text-sm text-blue-700 underline" href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a><span className="text-xs text-slate-500 ml-2">{(doc.sizeBytes / 1048576).toFixed(1)} MB</span></li>)}</ul></details>}
  </div>;
};

export const MarverReferenceSummary = ({ spec }: { spec: MarverSpecification }) => <aside className="rounded-2xl bg-white border p-4 space-y-3 lg:sticky lg:top-4 lg:self-start" aria-label="Resumen de referencia Marver">
  <h3 className="text-sm font-black">{spec.formName}</h3><p className="text-sm font-bold">{spec.modelName || 'Modelo pendiente'}</p>
  <p className="text-xs text-amber-800 bg-amber-50 rounded-lg p-3">Solicitud de referencia. Requiere revisión técnica y valoración antes de fabricar.</p>
  <dl className="space-y-3 text-xs">{spec.answers.map(answer => <div key={answer.fieldId}><dt className="text-slate-500">{answer.label}</dt><dd className="font-semibold break-words">{answer.value}</dd></div>)}</dl>
</aside>;
