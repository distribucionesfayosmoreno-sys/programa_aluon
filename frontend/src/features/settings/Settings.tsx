import { SettingsHeader } from './SettingsHeader';
import { SettingsModuleCards } from './SettingsModuleCards';
import { SettingsSignaturesSection } from './SettingsSignaturesSection';
import { SettingsTemplatesSection } from './SettingsTemplatesSection';
import { SettingsWhatsappSection } from './SettingsWhatsappSection';
import type { SettingsTab } from './Settings.types';
import { useSettings } from './useSettings';

const Settings = () => {
  const {
    activeTab,
    signatures,
    loading,
    form,
    statusMessage,
    templates,
    selectedTemplate,
    templateSubject,
    templateBody,
    whatsappTemplates,
    selectedWhatsappTemplate,
    whatsappMessage,
    testEmail,
    testNombre,
    testTelefono,
    previewHtml,
    setActiveTab,
    handleInputChange,
    handleSubmit,
    handleCopyHtml,
    handleUseSignature,
    handleTemplateSelect,
    handleTemplateSave,
    handleWhatsappTemplateSelect,
    handleWhatsappTemplateSave,
    handleSendTest,
    setTemplateSubject,
    setTemplateBody,
    setWhatsappMessage,
    setTestEmail,
    setTestNombre,
    setTestTelefono,
  } = useSettings();

  const moduleCards: Array<{
    key: SettingsTab;
    title: string;
    description: string;
    accent: string;
    icon: JSX.Element;
  }> = [
    {
      key: 'signatures',
      title: 'Firmas de email',
      description: 'Genera firmas HTML con logo corporativo y datos de contacto.',
      accent: '#e5534b',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10M7 15h6" />
        </svg>
      ),
    },
    {
      key: 'templates',
      title: 'Plantillas de email',
      description: 'Personaliza asuntos y contenidos para inscripción y validación.',
      accent: '#2563eb',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
        </svg>
        ),
      },
    {
      key: 'whatsapp',
      title: 'WhatsApp',
      description: 'Configura el texto que se abre al compartir presupuestos por WhatsApp.',
      accent: '#16a34a',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 11.8c0 4.7-3.8 8.5-8.5 8.5-1.5 0-2.9-.4-4.1-1l-4.2 1.1 1.1-4.1c-.7-1.3-1.1-2.8-1.1-4.5 0-4.7 3.8-8.5 8.5-8.5s8.3 3.8 8.3 8.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 8.8c.2-.3.4-.3.7-.3h.5c.2 0 .5.1.6.4l.9 2.1c.1.2.1.4 0 .6l-.4.5c-.1.2-.1.4 0 .6.4.7 1.1 1.5 1.8 1.9.2.1.4.1.6 0l.5-.3c.2-.1.4-.1.6 0l1.9.8c.3.1.4.4.4.7 0 1-.8 1.8-1.8 1.8-4.2 0-7.6-3.4-7.6-7.6 0-.5.1-1 .3-1.5l.1-.2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 540 }}>
      <SettingsHeader />

      <div className="space-y-6">
        <SettingsModuleCards cards={moduleCards} activeTab={activeTab} onSelect={setActiveTab} />

        {statusMessage && activeTab !== 'signatures' ? (
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm font-semibold text-secondary">
            {statusMessage}
          </div>
        ) : null}

        <section
          className="rounded-2xl p-6 space-y-6"
          style={{ border: '1px solid #e5e7eb', background: '#fff' }}
        >
          {activeTab === 'signatures' && (
            <SettingsSignaturesSection
              form={form}
              signatures={signatures}
              loading={loading}
              statusMessage={statusMessage}
              previewHtml={previewHtml}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
              onCopyHtml={handleCopyHtml}
              onUseSignature={handleUseSignature}
            />
          )}
          {activeTab === 'templates' && (
            <SettingsTemplatesSection
              templates={templates}
              selectedTemplate={selectedTemplate}
              templateSubject={templateSubject}
              templateBody={templateBody}
              testEmail={testEmail}
              testNombre={testNombre}
              testTelefono={testTelefono}
              onSelectTemplate={handleTemplateSelect}
              onSendTest={handleSendTest}
              onSaveTemplate={handleTemplateSave}
              onChangeSubject={setTemplateSubject}
              onChangeBody={setTemplateBody}
              onChangeTestEmail={setTestEmail}
              onChangeTestNombre={setTestNombre}
              onChangeTestTelefono={setTestTelefono}
            />
          )}
          {activeTab === 'whatsapp' && (
            <SettingsWhatsappSection
              templates={whatsappTemplates}
              selectedTemplate={selectedWhatsappTemplate}
              messageText={whatsappMessage}
              onSelectTemplate={handleWhatsappTemplateSelect}
              onSaveTemplate={handleWhatsappTemplateSave}
              onChangeMessage={setWhatsappMessage}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
