import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { EmailSignature, EmailSignatureForm, EmailTemplate } from './models';
import type { SettingsTab } from './Settings.types';
import {
  createEmailSignature,
  getEmailSignatures,
  getEmailTemplates,
  sendEmailTemplateTest,
  updateEmailTemplate,
} from '../../services/emailSettingsApi';

const DEFAULT_FORM: EmailSignatureForm = {
  fullName: '',
  role: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  logoUrl: '',
  accentColor: '#e5534b',
};

type UseSettingsState = {
  activeTab: SettingsTab;
  signatures: EmailSignature[];
  loading: boolean;
  form: EmailSignatureForm;
  selectedSignature: EmailSignature | null;
  statusMessage: string | null;
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  templateSubject: string;
  templateBody: string;
  testEmail: string;
  testNombre: string;
  testTelefono: string;
  previewHtml: string;
  setActiveTab: (tab: SettingsTab) => void;
  handleInputChange: (field: keyof EmailSignatureForm) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleCopyHtml: () => Promise<void>;
  handleUseSignature: (signature: EmailSignature) => void;
  handleTemplateSelect: (templateId: string) => void;
  handleTemplateSave: () => Promise<void>;
  handleSendTest: () => Promise<void>;
  setTemplateSubject: (value: string) => void;
  setTemplateBody: (value: string) => void;
  setTestEmail: (value: string) => void;
  setTestNombre: (value: string) => void;
  setTestTelefono: (value: string) => void;
};

export const useSettings = (): UseSettingsState => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('signatures');
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EmailSignatureForm>(DEFAULT_FORM);
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testNombre, setTestNombre] = useState('Cliente Demo');
  const [testTelefono, setTestTelefono] = useState('600 000 000');

  const previewHtml = useMemo(() => selectedSignature?.html ?? '', [selectedSignature]);

  useEffect(() => {
    const fetchSignatures = async () => {
      setLoading(true);
      try {
        const data = await getEmailSignatures();
        setSignatures(data);
        setSelectedSignature(data[0] ?? null);
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : 'Error al cargar firmas');
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getEmailTemplates();
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0]);
          setTemplateSubject(data[0].subject);
          setTemplateBody(data[0].bodyHtml);
        }
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : 'Error al cargar plantillas');
      }
    };

    fetchTemplates();
  }, []);

  const handleInputChange = useCallback(
    (field: keyof EmailSignatureForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const payload = {
      fullName: form.fullName.trim(),
      role: form.role.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim(),
      website: form.website.trim() || null,
      address: form.address.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      accentColor: form.accentColor.trim() || null,
    };

    try {
      const created = await createEmailSignature(payload);
      setSignatures(prev => [created, ...prev]);
      setSelectedSignature(created);
      setStatusMessage('Firma generada correctamente.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Error al generar firma');
    }
  }, [form]);

  const handleCopyHtml = useCallback(async () => {
    if (!selectedSignature?.html) return;
    try {
      await navigator.clipboard.writeText(selectedSignature.html);
      setStatusMessage('HTML copiado al portapapeles.');
    } catch {
      setStatusMessage('No se pudo copiar el HTML.');
    }
  }, [selectedSignature]);

  const handleUseSignature = useCallback((signature: EmailSignature) => {
    setSelectedSignature(signature);
  }, []);

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      const selected = templates.find(template => template.id === templateId) ?? null;
      setSelectedTemplate(selected);
      setTemplateSubject(selected?.subject ?? '');
      setTemplateBody(selected?.bodyHtml ?? '');
    },
    [templates],
  );

  const handleTemplateSave = useCallback(async () => {
    if (!selectedTemplate) return;
    try {
      const updated = await updateEmailTemplate(selectedTemplate.id, {
        templateKey: selectedTemplate.templateKey,
        subject: templateSubject,
        bodyHtml: templateBody,
      });
      setTemplates(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      setSelectedTemplate(updated);
      setStatusMessage('Plantilla actualizada.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Error al guardar plantilla');
    }
  }, [selectedTemplate, templateBody, templateSubject]);

  const handleSendTest = useCallback(async () => {
    if (!selectedTemplate) return;
    try {
      await sendEmailTemplateTest({
        templateKey: selectedTemplate.templateKey,
        to: testEmail,
        nombreComercial: testNombre,
        email: testEmail,
        telefono: testTelefono,
      });
      setStatusMessage('Correo de prueba enviado.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Error al enviar prueba');
    }
  }, [selectedTemplate, testEmail, testNombre, testTelefono]);

  return {
    activeTab,
    signatures,
    loading,
    form,
    selectedSignature,
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
  };
};
