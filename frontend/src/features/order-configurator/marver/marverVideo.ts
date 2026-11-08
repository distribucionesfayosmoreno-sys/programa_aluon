import { cleanSpecification, type MarverSpecification, type ReferenceCatalog } from './marverReference';

export type VideoForm = { id: string; specification: MarverSpecification };
export type VideoDraft = {
  forms: VideoForm[];
  editing: VideoForm | null;
  view: 'catalog' | 'form' | 'summary';
  customerId: string;
  customerName: string;
  reference: string;
  notes: string;
};
export const VIDEO_DRAFT_KEY = 'aluon-marver-video-draft';
export const createVideoDraft = (): VideoDraft => ({ forms: [], editing: null, view: 'catalog', customerId: '', customerName: '', reference: 'MV-' + Date.now().toString(36).toUpperCase(), notes: '' });

export const restoreVideoDraft = (input: unknown, catalog: ReferenceCatalog, documents: unknown = []): VideoDraft => {
  if (!input || typeof input !== 'object') return createVideoDraft();
  const source = input as Partial<VideoDraft>;
  const restoreForm = (item: VideoForm): VideoForm | null => {
    if (!item || typeof item.id !== 'string' || !item.specification || typeof item.specification.values !== 'object' || item.specification.values === null) return null;
    const form = catalog.forms.find(form => form.id === item.specification.formId);
    if (!form) return null;
    const model = form.models.find(model => model.id === item.specification.modelId);
    return { id: item.id, specification: cleanSpecification(form, { ...item.specification, formName: form.name, modelId: model?.id ?? '', modelName: model?.name ?? '', attachments: Array.isArray(item.specification.attachments) ? item.specification.attachments.map(attachment => { const document = Array.isArray(documents) ? documents.find(document => document?.formId === item.id && document?.fieldId === attachment.fieldId && typeof document?.contentBase64 === 'string') : null; return { ...attachment, contentBase64: document?.contentBase64 ?? attachment.contentBase64 }; }) : [] }) };
  };
  const forms = Array.isArray(source.forms) ? source.forms.slice(0, 50).map(restoreForm).filter((item): item is VideoForm => item !== null) : [];
  const editing = source.editing ? restoreForm(source.editing) : null;
  return {
    ...createVideoDraft(), forms, editing,
    view: source.view === 'form' && editing ? 'form' : source.view === 'summary' ? 'summary' : 'catalog',
    customerId: typeof source.customerId === 'string' ? source.customerId : '',
    customerName: typeof source.customerName === 'string' ? source.customerName : '',
    reference: typeof source.reference === 'string' ? source.reference : '',
    notes: typeof source.notes === 'string' ? source.notes : '',
  };
};

export const videoFormsToSave = (draft: VideoDraft): VideoForm[] => draft.editing
  ? draft.forms.some(item => item.id === draft.editing?.id) ? draft.forms.map(item => item.id === draft.editing?.id ? draft.editing! : item) : [...draft.forms, draft.editing]
  : draft.forms;

export const videoAttachmentBytes = (forms: VideoForm[]): number => forms.reduce((total, item) => total + (item.specification.attachments ?? []).reduce((bytes, attachment) => bytes + Math.ceil((attachment.contentBase64.split(',')[1]?.length ?? 0) * 3 / 4), 0), 0);

export const buildVideoPayload = (draft: VideoDraft) => {
  const forms = videoFormsToSave(draft);
  const metadataOnly = (specification: MarverSpecification): MarverSpecification => ({ ...specification, attachments: specification.attachments?.map(attachment => ({ ...attachment, contentBase64: '' })) });
  const metadataForms = forms.map(item => ({ ...item, specification: metadataOnly(item.specification) }));
  return {
    presentation: 'MARVER_VIDEO',
    referenceSpecification: metadataForms[0]?.specification,
    videoForms: metadataForms,
    videoDraft: { ...draft, forms: draft.forms.map(item => ({ ...item, specification: metadataOnly(item.specification) })), editing: draft.editing ? { ...draft.editing, specification: metadataOnly(draft.editing.specification) } : null },
    model: forms[0]?.specification.modelName ?? '',
    notes: draft.notes,
    generatedDocuments: forms.flatMap(item => (item.specification.attachments ?? []).map(attachment => ({ ...attachment, formId: item.id }))),
  };
};
