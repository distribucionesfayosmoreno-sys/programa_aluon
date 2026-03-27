import type { EmailTemplate } from './models';

type SettingsTemplatesSectionProps = {
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  templateSubject: string;
  templateBody: string;
  testEmail: string;
  testNombre: string;
  testTelefono: string;
  onSelectTemplate: (templateId: string) => void;
  onSendTest: () => void;
  onSaveTemplate: () => void;
  onChangeSubject: (value: string) => void;
  onChangeBody: (value: string) => void;
  onChangeTestEmail: (value: string) => void;
  onChangeTestNombre: (value: string) => void;
  onChangeTestTelefono: (value: string) => void;
};

export const SettingsTemplatesSection = ({
  templates,
  selectedTemplate,
  templateSubject,
  templateBody,
  testEmail,
  testNombre,
  testTelefono,
  onSelectTemplate,
  onSendTest,
  onSaveTemplate,
  onChangeSubject,
  onChangeBody,
  onChangeTestEmail,
  onChangeTestNombre,
  onChangeTestTelefono,
}: SettingsTemplatesSectionProps) => (
  <>
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-lg font-black uppercase" style={{ color: '#0d1117' }}>
          Plantillas de correo
        </h2>
        <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
          Edita el contenido base de los correos de inscripción y validación.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-ghost" type="button" onClick={onSendTest} disabled={!testEmail}>
          Enviar prueba
        </button>
        <button className="btn-primary" type="button" onClick={onSaveTemplate}>
          Guardar plantilla
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
      <div>
        <label className="field-label">Seleccionar plantilla</label>
        <select className="field" value={selectedTemplate?.id ?? ''} onChange={event => onSelectTemplate(event.target.value)}>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.templateKey}
            </option>
          ))}
        </select>
        <div className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
          Variables disponibles:
          <div className="mt-2 space-y-1">
            <div>{'{{nombreComercial}}'}</div>
            <div>{'{{email}}'}</div>
            <div>{'{{telefono}}'}</div>
            <div>{'{{signatureHtml}}'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="field-label">Asunto</label>
          <input
            className="field"
            value={templateSubject}
            onChange={event => onChangeSubject(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label">HTML del correo</label>
          <textarea
            className="field"
            rows={10}
            value={templateBody}
            onChange={event => onChangeBody(event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="field-label">Email de prueba</label>
            <input
              className="field"
              type="email"
              value={testEmail}
              onChange={event => onChangeTestEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Nombre comercial</label>
            <input
              className="field"
              value={testNombre}
              onChange={event => onChangeTestNombre(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Teléfono</label>
            <input
              className="field"
              value={testTelefono}
              onChange={event => onChangeTestTelefono(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  </>
);
