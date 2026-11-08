import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Customer } from '../../../hooks/useCustomers';
import { ReferenceInput } from './MarverReferenceFields';
import { cleanSpecification, createSpecification, referenceErrors, referenceOptions, visibleReferenceFields, type MarverSpecification, type ReferenceCatalog, type ReferenceField, type ReferenceForm } from './marverReference';
import { createVideoDraft, restoreVideoDraft, VIDEO_DRAFT_KEY, videoAttachmentBytes, videoFormsToSave, type VideoDraft, type VideoForm } from './marverVideo';
import './marverVideo.css';

type Preview = { title: string; image?: string; forms?: VideoForm[]; commit?: boolean };

const Modal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="mv-modal" aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Cerrar ventana">×</button></header>
    {children}
  </dialog>;
};

const VideoQuestion = ({ field, form, spec, onChange, preview }: { field: ReferenceField; form: ReferenceForm; spec: MarverSpecification; onChange: (spec: MarverSpecification) => void; preview: (preview: Preview) => void }) => {
  const options = referenceOptions(field, form, spec);
  const value = spec.values[field.id];
  if (!options.some(option => option.image)) return <div className="mv-question" data-filled={value !== undefined && value !== ''}><ReferenceInput field={field} form={form} spec={spec} onChange={onChange} /></div>;
  return <fieldset className="mv-question"><legend>{field.label}</legend><div className={'mv-gallery' + (field.sourceKey === 'tipoApertura' ? ' mv-openings' : '')}>
    {options.map(option => <div key={option.value} className="mv-option" data-selected={value === option.value}>
      <button type="button" className="mv-card-choice" aria-label={option.label} aria-pressed={value === option.value} onClick={() => onChange(cleanSpecification(form, { ...spec, values: { ...spec.values, [field.id]: option.value } }))}>
        <span>{option.label}</span>{option.image && <img src={option.image} alt={option.label} loading="lazy" />}
      </button>
      {option.image && <button type="button" className="mv-image-link" onClick={() => preview({ title: option.label, image: option.image ?? undefined })} aria-label={'Ampliar ' + option.label}>Ampliar imagen</button>}
    </div>)}
  </div></fieldset>;
};

const FormDetails = ({ catalog, items }: { catalog: ReferenceCatalog; items: VideoForm[] }) => <div className="mv-details">
  {items.map((item, index) => {
    const spec = item.specification;
    const form = catalog.forms.find(form => form.id === spec.formId);
    const model = form?.models.find(model => model.id === spec.modelId);
    const imageAnswers = form?.fields.flatMap(field => { const option = field.options.find(option => option.value === spec.values[field.id]); return option?.image ? [{ field, option }] : []; }) ?? [];
    return <section key={item.id}>
      <h3>{items.length > 1 ? 'Formulario ' + (index + 1) + ': ' : ''}{spec.formName}</h3>
      <div className="mv-detail-grid">
        {model && <div><strong>MODELO PUERTA</strong><span>{model.name}</span>{model.image && <img src={model.image} alt={model.name} />}</div>}
        {imageAnswers.map(({ field, option }) => <div key={field.id} className={field.sourceKey === 'tipoApertura' ? 'mv-detail-wide' : ''}><strong>{field.label}</strong><span>{option.label}</span><img src={option.image!} alt={option.label} /></div>)}
        {spec.answers.filter(answer => !imageAnswers.some(({ field }) => field.id === answer.fieldId)).map(answer => <div key={answer.fieldId}><strong>{answer.label}</strong><span>{answer.value}</span></div>)}
      </div>
    </section>;
  })}
</div>;

export default function MarverVideoConfigurator({ catalog, customers }: { catalog: ReferenceCatalog; customers: Customer[] }) {
  const [draft, setDraft] = useState<VideoDraft>(() => {
    try { return restoreVideoDraft(JSON.parse(localStorage.getItem(VIDEO_DRAFT_KEY) || 'null'), catalog); } catch { return createVideoDraft(); }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const selectedForm = catalog.forms.find(form => form.id === draft.editing?.specification.formId);
  const spec = draft.editing?.specification;

  useEffect(() => {
    try { localStorage.setItem(VIDEO_DRAFT_KEY, JSON.stringify(draft)); setStorageWarning(''); }
    catch { setStorageWarning('El navegador no tiene espacio para conservar este borrador completo. Guarda el borrador en el servidor antes de salir.'); }
  }, [draft]);
  const scrollTop = () => surface.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  const changeView = (view: VideoDraft['view']) => { setDraft(current => ({ ...current, view })); setError(''); scrollTop(); };
  const startForm = (form: ReferenceForm) => {
    if (draft.forms.length >= 50) { setError('El presupuesto admite hasta 50 formularios.'); return; }
    setDraft(current => ({ ...current, editing: { id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'form-' + Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(36)).join('-'), specification: createSpecification(form) }, view: 'form' })); setError(''); scrollTop();
  };
  const changeSpec = (specification: MarverSpecification) => {
    const next = { ...draft, editing: draft.editing ? { ...draft.editing, specification } : null };
    if (videoAttachmentBytes(videoFormsToSave(next)) > 8 * 1024 * 1024) { setError('Los adjuntos del presupuesto no pueden superar 8 MB en total.'); return; }
    setDraft(next); setError('');
  };
  const reviewForm = () => {
    if (!draft.editing) return;
    const errors = referenceErrors(catalog, draft.editing.specification);
    if (errors.length) { setError(errors[0]); return; }
    setError(''); setPreview({ title: 'Detalle del pedido', forms: [draft.editing], commit: true });
  };
  const commitForm = () => {
    if (!draft.editing) return;
    setDraft(current => ({ ...current, forms: videoFormsToSave(current), editing: null, view: 'summary' }));
    setPreview(null); setError(''); scrollTop();
  };
  const save = async (status: 'DRAFT' | 'PENDING_REVIEW') => {
    const items = videoFormsToSave(draft);
    if (!items.length) { setError('Añade al menos un formulario al presupuesto.'); return; }
    if (!draft.reference.trim()) { setError('Introduce la referencia del presupuesto.'); return; }
    if (status === 'PENDING_REVIEW') {
      if (!draft.customerName.trim()) { setError('Selecciona un cliente o introduce su nombre.'); return; }
      const errors = items.flatMap(item => referenceErrors(catalog, item.specification));
      if (errors.length) { setError(errors[0]); return; }
    }
    setBusy(true); setError(''); setMessage('');
    setMessage(status === 'DRAFT'
      ? 'Borrador local preparado. El recorrido Marver no se guarda en presupuestos ni pedidos.'
      : 'Simulación completada. Esta vista no entra en el flujo real de la aplicación.');
    setBusy(false);
  };
  const pdf = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const document = new jsPDF(); let y = 20;
      const line = (value: string) => {
        for (const text of document.splitTextToSize(value, 174) as string[]) {
          if (y > 275) { document.addPage(); y = 20; }
          document.text(text, 18, y); y += 6;
        }
      };
      document.setFontSize(15); line('ALUON · REFERENCIA MARVER'); document.setFontSize(10);
      line(draft.reference + ' · ' + (draft.customerName || 'Cliente pendiente'));
      line('Pendiente de revisión técnica y valoración.');
      videoFormsToSave(draft).forEach((item, index) => { y += 7; line('Formulario ' + (index + 1) + ': ' + item.specification.formName); line('Modelo: ' + (item.specification.modelName || 'Sin modelo')); item.specification.answers.forEach(answer => line(answer.label + ': ' + answer.value)); });
      if (draft.notes) { y += 7; line('Observaciones: ' + draft.notes); }
      document.save((draft.reference.replace(/[^a-zA-Z0-9_-]/g, '-') || 'referencia-marver') + '.pdf');
    } catch { setError('No se pudo generar el PDF. El borrador se conserva.'); }
  };
  const categories = [...new Set(catalog.forms.map(form => form.category))];
  const nativeFields = selectedForm && spec ? visibleReferenceFields(selectedForm, spec) : [];
  // The video follows the original form order, with model-dependent questions below its colour gallery.
  const colorIndex = nativeFields.findIndex(field => field.sourceKey === 'mColores');
  const firstFields = colorIndex < 0 ? [] : nativeFields.slice(0, colorIndex + 1);
  const remainingFields = colorIndex < 0 ? nativeFields : nativeFields.slice(colorIndex + 1);

  return <div className="marver-video" ref={surface} aria-label="Configurador Marver según vídeo">
    <div className="mv-toolbar"><span>Recorrido Marver · Vídeo 28/10/2026</span><div>
      <button type="button" onClick={() => setConfirmReset(true)} disabled={busy}>Nueva simulación</button>
    </div></div>
    {error && <p role="alert" className="mv-alert">{error}</p>}
    {message && <p role="status" className="mv-success">{message}</p>}
    {storageWarning && <p role="alert" className="mv-alert">{storageWarning}</p>}
    {draft.view === 'catalog' && <div className="mv-catalog">
      <p className="mv-intro">Si su presupuesto se compone de una o varias puertas, o incluso de tramos de vallado, podrá añadir más formularios una vez que rellene el primero seleccionado.</p>
      {draft.editing && <button type="button" className="mv-outline" onClick={() => changeView('form')}>Continuar formulario sin terminar · {draft.editing.specification.formName}</button>}
      {draft.forms.length > 0 && <button type="button" className="mv-primary" onClick={() => changeView('summary')}>Ver resumen del presupuesto ({draft.forms.length})</button>}
      {categories.map(category => <section key={category}><h2>{category}</h2><div className="mv-product-grid">{catalog.forms.filter(form => form.category === category).map(form => <button type="button" key={form.id} aria-label={'Configurar ' + form.name} className="mv-product" onClick={() => startForm(form)} disabled={busy || draft.editing !== null}>
        {form.image ? <img src={form.image} alt={form.name} loading="lazy" /> : <span>{form.name}</span>}
      </button>)}</div></section>)}
    </div>}
    {draft.view === 'form' && selectedForm && spec && <article className="mv-form">
      <div className="mv-form-heading"><button type="button" onClick={() => changeView('catalog')}>← Volver a las familias</button><h2>{selectedForm.name}</h2><p>Configure su puerta y revise los detalles antes de guardar el formulario.</p></div>
      <div className="mv-question"><label htmlFor="mv-door-type">Tipo de puerta</label><input id="mv-door-type" className="mv-door-type" value={selectedForm.category} readOnly /></div>
      {selectedForm.models.length > 0 && <fieldset className="mv-question"><legend>Modelo</legend><div className="mv-gallery">{selectedForm.models.map(model => <div key={model.id} className="mv-option" data-selected={spec.modelId === model.id}>
        <button type="button" className="mv-card-choice" aria-label={model.name} aria-pressed={spec.modelId === model.id} onClick={() => changeSpec(cleanSpecification(selectedForm, { ...spec, modelId: model.id, modelName: model.name }))}><span>{model.name}</span>{model.image && <img src={model.image} alt={model.name} loading="lazy" />}</button>
        {model.image && <button type="button" className="mv-image-link" onClick={() => setPreview({ title: model.name, image: model.image ?? undefined })}>Ver modelo</button>}
      </div>)}</div></fieldset>}
      {firstFields.map(field => <VideoQuestion key={field.id} field={field} form={selectedForm} spec={spec} onChange={changeSpec} preview={setPreview} />)}
      {remainingFields.filter(field => !field.appearance.startsWith('Adicional')).map(field => <VideoQuestion key={field.id} field={field} form={selectedForm} spec={spec} onChange={changeSpec} preview={setPreview} />)}
      {remainingFields.some(field => field.appearance.startsWith('Adicional')) && <section className="mv-extra"><h3>Más opciones de la plantilla</h3><p>Opciones del documento de referencia cuya aplicabilidad se confirma en revisión técnica.</p>{remainingFields.filter(field => field.appearance.startsWith('Adicional')).map(field => <VideoQuestion key={field.id} field={field} form={selectedForm} spec={spec} onChange={changeSpec} preview={setPreview} />)}</section>}
      <div className="mv-form-actions"><button type="button" className="mv-save" onClick={reviewForm} disabled={busy}>Guardar formulario local</button><button type="button" onClick={() => void save('DRAFT')} disabled={busy}>Guardar borrador local</button><button type="button" onClick={() => { setDraft(current => ({ ...current, editing: null, view: current.forms.length ? 'summary' : 'catalog' })); setError(''); }}>Descartar cambios del formulario</button></div>
      {error && <p role="alert" className="mv-alert">{error}</p>}
    </article>}
    {draft.view === 'summary' && <article className="mv-final">
      <div className="mv-brand">ALUON <span>Configurador Marver</span></div><p className="mv-kicker">PASO FINAL</p><h2>¿Qué desea hacer?</h2><p>Cierre el proceso, añada más líneas o consulte el detalle cuando lo necesite.</p>
      <button type="button" className="mv-primary" onClick={() => void save('PENDING_REVIEW')} disabled={busy || !draft.forms.length}>{busy ? 'Procesando…' : 'Simular presupuesto'}</button>
      <button type="button" className="mv-outline" onClick={() => changeView('catalog')} disabled={busy}>Añadir otra puerta</button>
      <section className="mv-budget-lines"><p className="mv-kicker">LÍNEAS DEL PRESUPUESTO</p><h3>Resumen del presupuesto</h3>{draft.forms.map((item, index) => <div className="mv-budget-line" key={item.id}><span><strong>Formulario {index + 1}:</strong> {item.specification.formName}<small>{item.specification.modelName}</small></span><div><button type="button" aria-label={'Editar formulario ' + (index + 1)} onClick={() => { setDraft(current => ({ ...current, editing: item, view: 'form' })); scrollTop(); }}>Editar</button><button type="button" aria-label={'Eliminar formulario ' + (index + 1)} onClick={() => setDraft(current => ({ ...current, forms: current.forms.filter(row => row.id !== item.id) }))}>Eliminar</button></div></div>)}{!draft.forms.length && <p>No hay formularios guardados todavía.</p>}</section>
      <div className="mv-customer"><h3>Cliente y referencia</h3><label htmlFor="mv-customer">Cliente del CRM</label><select id="mv-customer" value={draft.customerId} onChange={event => { const customer = customers.find(customer => customer.id === event.target.value); setDraft(current => ({ ...current, customerId: event.target.value, customerName: customer?.nombreComercial || customer?.razonSocial || current.customerName })); }}><option value="">Seleccionar cliente o escribir su nombre</option>{customers.filter(customer => customer.id).map(customer => <option key={customer.id} value={customer.id}>{customer.nombreComercial || customer.razonSocial}</option>)}</select>
        <label htmlFor="mv-customer-name">Nombre del cliente</label><input id="mv-customer-name" value={draft.customerName} onChange={event => setDraft(current => ({ ...current, customerId: '', customerName: event.target.value }))} />
        <label htmlFor="mv-reference">Referencia del presupuesto</label><input id="mv-reference" value={draft.reference} onChange={event => setDraft(current => ({ ...current, reference: event.target.value }))} />
        <label htmlFor="mv-notes">Observaciones</label><textarea id="mv-notes" value={draft.notes} onChange={event => setDraft(current => ({ ...current, notes: event.target.value }))} />
      </div>
      <p className="mv-kicker">CONSULTAR O REINICIAR</p><button type="button" className="mv-outline" disabled={!draft.forms.length} onClick={() => setPreview({ title: 'Detalle del presupuesto', forms: draft.forms })}>Ver detalle del presupuesto</button>
      <button type="button" className="mv-outline" disabled={!draft.forms.length || busy} onClick={() => void pdf()}>Descargar PDF de referencia</button>
      <button type="button" className="mv-outline" disabled={busy} onClick={() => void save('DRAFT')}>Guardar borrador local</button>
      <button type="button" className="mv-reset" onClick={() => setConfirmReset(true)}>Empezar el presupuesto de nuevo</button>
      <p className="mv-review-note">Las referencias se envían a revisión técnica y valoración. Los precios y la fabricación se confirman por ALUON.</p>
    </article>}
    {preview && <Modal title={preview.title} onClose={() => setPreview(null)}>{preview.image && <img className="mv-zoom-image" src={preview.image} alt={preview.title} />}{preview.forms && <FormDetails catalog={catalog} items={preview.forms} />}{preview.commit && <footer><button type="button" className="mv-save" onClick={commitForm}>Guardar Formulario</button><button type="button" onClick={() => setPreview(null)}>Editar formulario</button></footer>}</Modal>}
    {confirmReset && <Modal title="Empezar la simulación de nuevo" onClose={() => setConfirmReset(false)}><p className="mv-modal-message">Se eliminarán los formularios del borrador actual en este navegador. Esta simulación no crea presupuestos ni pedidos reales.</p><footer><button type="button" onClick={() => setConfirmReset(false)}>Cancelar</button><button type="button" className="mv-primary" onClick={() => { setDraft(createVideoDraft()); setError(''); setMessage(''); setConfirmReset(false); }}>Empezar de nuevo</button></footer></Modal>}
  </div>;
}
