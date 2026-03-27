import { SettingsHeader } from './settings/SettingsHeader';
import { SettingsModuleCards } from './settings/SettingsModuleCards';
import { SettingsSignaturesSection } from './settings/SettingsSignaturesSection';
import { SettingsTemplatesSection } from './settings/SettingsTemplatesSection';
import type { SettingsTab } from './settings/Settings.types';
import { useSettings } from './settings/useSettings';

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
    handleSendTest,
    setTemplateSubject,
    setTemplateBody,
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
  ];

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 540 }}>
      <SettingsHeader />

      <div className="space-y-6">
        <SettingsModuleCards cards={moduleCards} activeTab={activeTab} onSelect={setActiveTab} />

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
        </section>
      </div>
    </div>
  );
};

export default Settings;
