import type { WhatsappTemplate } from './models';

type SettingsWhatsappSectionProps = {
  templates: WhatsappTemplate[];
  selectedTemplate: WhatsappTemplate | null;
  messageText: string;
  onSelectTemplate: (templateId: string) => void;
  onSaveTemplate: () => void;
  onChangeMessage: (value: string) => void;
};

export const SettingsWhatsappSection = ({
  templates,
  selectedTemplate,
  messageText,
  onSelectTemplate,
  onSaveTemplate,
  onChangeMessage,
}: SettingsWhatsappSectionProps) => (
  <>
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-lg font-black uppercase" style={{ color: '#0d1117' }}>
          Mensajes de WhatsApp
        </h2>
        <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
          Edita el texto que se abrirá al pulsar el botón de WhatsApp en los presupuestos.
        </p>
      </div>
      <button className="btn-primary" type="button" onClick={onSaveTemplate}>
        Guardar mensaje
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
      <div>
        <label className="field-label">Plantilla activa</label>
        <select
          className="field"
          value={selectedTemplate?.id ?? ''}
          onChange={event => onSelectTemplate(event.target.value)}
          disabled={templates.length === 0}
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.templateKey}
            </option>
          ))}
        </select>
        <div className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
          Variables disponibles:
          <div className="mt-2 space-y-1">
            <div>{'{{customerName}}'}</div>
            <div>{'{{quoteNumber}}'}</div>
            <div>{'{{total}}'}</div>
            <div>{'{{documentUrl}}'}</div>
            <div>{'{{phone}}'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="field-label">Texto del mensaje</label>
          <textarea
            className="field"
            rows={10}
            value={messageText}
            onChange={event => onChangeMessage(event.target.value)}
            placeholder="Hola {{customerName}}, te envío tu presupuesto {{quoteNumber}}..."
          />
        </div>
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container p-4 text-xs text-secondary space-y-1">
          <div className="font-black uppercase tracking-widest text-[10px]">Notas</div>
          <p>El enlace al PDF se añade automáticamente al mensaje final.</p>
          <p>Si el número del cliente está disponible, WhatsApp abrirá el chat directo con ese destinatario.</p>
        </div>
      </div>
    </div>
  </>
);
