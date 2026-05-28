import type { FC } from 'react';
import AppDialog from '../../components/feedback/AppDialog';
import type { JiraCreateIssueDialogProps } from './JiraCreateIssueDialog.types';
import { useJiraCreateIssueDialog } from './useJiraCreateIssueDialog';

export const JiraCreateIssueDialog: FC<JiraCreateIssueDialogProps> = ({ open, onClose, context, onCreated }) => {
  const { summary, description, attachments, setSummary, setDescription, setAttachments, isSubmitting, canSubmit, errorMessage, submit } =
    useJiraCreateIssueDialog(onClose, context, onCreated);

  const icon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <AppDialog
      open={open}
      title="Crear ticket en Jira"
      subtitle="Resumen y descripción"
      tone="neutral"
      icon={icon}
      onClose={onClose}
      actions={(
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={submit} disabled={!canSubmit}>
            {isSubmitting ? 'Creando...' : 'Crear'}
          </button>
        </>
      )}
    >
      <div className="space-y-4">
        <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
          <div className="text-xs font-black uppercase tracking-wide" style={{ color: '#6b7280' }}>
            Contexto
          </div>
          <div className="mt-2 text-sm leading-6">
            <div><span className="font-semibold">Entorno:</span> {context.environmentName}</div>
            <div><span className="font-semibold">Módulo:</span> {context.moduleLabel} ({context.moduleKey})</div>
            <div>
              <span className="font-semibold">Responsive:</span>{' '}
              {context.viewport.category} ({context.viewport.widthPx}x{context.viewport.heightPx}, dpr {context.viewport.devicePixelRatio})
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Resumen
          </label>
          <input
            value={summary}
            onChange={e => setSummary(e.currentTarget.value)}
            className="w-full px-4 py-3 rounded-xl border"
            style={{ borderColor: '#e5e7eb', outline: 'none' }}
            placeholder="Ej: Bug al guardar cliente"
            maxLength={250}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Descripción (opcional)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
            className="w-full px-4 py-3 rounded-xl border min-h-[120px]"
            style={{ borderColor: '#e5e7eb', outline: 'none', resize: 'vertical' }}
            placeholder="Pasos para reproducir, contexto, etc."
            maxLength={20000}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Imágenes adjuntas (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => {
              const list = Array.from(e.currentTarget.files ?? []);
              setAttachments(list);
            }}
          />
          {attachments.length > 0 && (
            <div className="mt-2 text-xs" style={{ color: '#6b7280' }}>
              {attachments.length} archivo(s) seleccionado(s)
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="text-sm rounded-xl px-4 py-3" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
            {errorMessage}
          </div>
        )}

        <div className="text-xs" style={{ color: '#6b7280' }}>
          El ticket se crea desde el backend (las credenciales de Jira no se exponen al navegador). La descripción incluirá el contexto (entorno/módulo/responsive).
        </div>
      </div>
    </AppDialog>
  );
};
