import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type FC } from 'react';
import type { EmailSignature, EmailSignatureForm, EmailTemplate } from './settings/models';

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

type SettingsTab = 'signatures' | 'templates';

const Settings: FC = () => {
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
        const response = await fetch('/api/settings/email-signatures');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las firmas');
        }
        const data = (await response.json()) as EmailSignature[];
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
        const response = await fetch('/api/settings/email-templates');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las plantillas');
        }
        const data = (await response.json()) as EmailTemplate[];
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

  const handleSubmit = useCallback(async (event: FormEvent) => {
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
      const response = await fetch('/api/settings/email-signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo generar la firma');
      }

      const created = (await response.json()) as EmailSignature;
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
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selected = templates.find(template => template.id === event.target.value) ?? null;
      setSelectedTemplate(selected);
      setTemplateSubject(selected?.subject ?? '');
      setTemplateBody(selected?.bodyHtml ?? '');
    },
    [templates],
  );

  const handleTemplateSave = useCallback(async () => {
    if (!selectedTemplate) return;
    try {
      const response = await fetch(`/api/settings/email-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateKey: selectedTemplate.templateKey,
          subject: templateSubject,
          bodyHtml: templateBody,
        }),
      });
      if (!response.ok) {
        throw new Error('No se pudo guardar la plantilla');
      }
      const updated = (await response.json()) as EmailTemplate;
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
      const response = await fetch('/api/settings/email-templates/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateKey: selectedTemplate.templateKey,
          to: testEmail,
          nombreComercial: testNombre,
          email: testEmail,
          telefono: testTelefono,
        }),
      });
      if (!response.ok) {
        throw new Error('No se pudo enviar el correo de prueba');
      }
      setStatusMessage('Correo de prueba enviado.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Error al enviar prueba');
    }
  }, [selectedTemplate, testEmail, testNombre, testTelefono]);

  const moduleCards = useMemo(() => ([
    {
      key: 'signatures' as const,
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
      key: 'templates' as const,
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
  ]), []);

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 540 }}>
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-5 rounded-full bg-brand" />
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>
            Ajustes
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#9ca3af' }}>
            CONFIGURACIÓN GENERAL
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {moduleCards.map(card => (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveTab(card.key)}
              className="text-left rounded-2xl p-6 transition-all duration-150"
              style={{
                background: '#ffffff',
                border: activeTab === card.key ? `1px solid ${card.accent}40` : '1px solid #e5e7eb',
                boxShadow: activeTab === card.key ? `0 18px 35px -25px ${card.accent}` : '0 8px 20px -18px rgba(15,23,42,0.3)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ border: '1px solid #eef2f7', color: card.accent, background: '#f9fafb' }}
              >
                {card.icon}
              </div>
              <div className="mt-5 text-sm font-black uppercase" style={{ color: '#0d1117' }}>
                {card.title}
              </div>
              <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
                {card.description}
              </p>
              <div className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                Configurar módulo
              </div>
              <div className="mt-2 h-1 rounded-full" style={{ background: `${card.accent}22` }}>
                <div className="h-1 rounded-full" style={{ width: activeTab === card.key ? '40%' : '18%', background: card.accent }} />
              </div>
            </button>
          ))}
        </section>

        <section
          className="rounded-2xl p-6 space-y-6"
          style={{ border: '1px solid #e5e7eb', background: '#fff' }}
        >
          {activeTab === 'signatures' && (
            <>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-black uppercase" style={{ color: '#0d1117' }}>
                    Generador de firmas
                  </h2>
                  <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
                    Crea firmas HTML con el logo de Aluon y pégalas en tu cliente de correo.
                  </p>
                </div>
                <button className="btn-ghost" type="button" onClick={handleCopyHtml}>
                  Copiar HTML
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Nombre completo *</label>
                  <input
                    className="field"
                    value={form.fullName}
                    onChange={handleInputChange('fullName')}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Cargo / puesto</label>
                  <input className="field" value={form.role} onChange={handleInputChange('role')} />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange('email')}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Teléfono</label>
                  <input className="field" value={form.phone} onChange={handleInputChange('phone')} />
                </div>
                <div>
                  <label className="field-label">Web</label>
                  <input className="field" value={form.website} onChange={handleInputChange('website')} />
                </div>
                <div>
                  <label className="field-label">Dirección</label>
                  <input className="field" value={form.address} onChange={handleInputChange('address')} />
                </div>
                <div>
                  <label className="field-label">URL Logo (opcional)</label>
                  <input className="field" value={form.logoUrl} onChange={handleInputChange('logoUrl')} />
                </div>
                <div>
                  <label className="field-label">Color acento</label>
                  <input className="field" value={form.accentColor} onChange={handleInputChange('accentColor')} />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <button className="btn-primary" type="submit">
                    Generar firma
                  </button>
                  {statusMessage && (
                    <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                      {statusMessage}
                    </span>
                  )}
                </div>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                    Firmas guardadas
                  </div>
                  <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="max-h-64 overflow-auto">
                      <table className="w-full text-left" style={{ fontSize: 12 }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
                          <tr style={{ background: '#f9fafb' }}>
                            <th className="px-3 py-2" style={{ borderBottom: '1px solid #e5e7eb' }}>Nombre</th>
                            <th className="px-3 py-2" style={{ borderBottom: '1px solid #e5e7eb' }}>Email</th>
                            <th style={{ borderBottom: '1px solid #e5e7eb', width: 90 }} />
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr><td className="px-3 py-4" colSpan={3}>Cargando...</td></tr>
                          ) : signatures.length === 0 ? (
                            <tr><td className="px-3 py-4" colSpan={3}>Sin firmas aún.</td></tr>
                          ) : signatures.map(signature => (
                            <tr key={signature.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td className="px-3 py-2.5">
                                <div className="font-semibold">{signature.fullName}</div>
                                <div className="text-[10px] uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                                  {signature.role || 'Sin cargo'}
                                </div>
                              </td>
                              <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>
                                {signature.email}
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <button
                                  className="btn-ghost"
                                  type="button"
                                  onClick={() => handleUseSignature(signature)}
                                >
                                  Usar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                    Previsualización
                  </div>
                  <div
                    className="mt-3 rounded-xl p-4"
                    style={{ border: '1px solid #e5e7eb', background: '#f9fafb', minHeight: 180 }}
                  >
                    {previewHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        Genera o selecciona una firma para verla aquí.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 'templates' && (
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
                  <button className="btn-ghost" type="button" onClick={handleSendTest} disabled={!testEmail}>
                    Enviar prueba
                  </button>
                  <button className="btn-primary" type="button" onClick={handleTemplateSave}>
                    Guardar plantilla
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
                <div>
                  <label className="field-label">Seleccionar plantilla</label>
                  <select className="field" value={selectedTemplate?.id ?? ''} onChange={handleTemplateSelect}>
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
                      onChange={event => setTemplateSubject(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">HTML del correo</label>
                    <textarea
                      className="field"
                      rows={10}
                      value={templateBody}
                      onChange={event => setTemplateBody(event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="field-label">Email de prueba</label>
                      <input
                        className="field"
                        type="email"
                        value={testEmail}
                        onChange={event => setTestEmail(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Nombre comercial</label>
                      <input
                        className="field"
                        value={testNombre}
                        onChange={event => setTestNombre(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Teléfono</label>
                      <input
                        className="field"
                        value={testTelefono}
                        onChange={event => setTestTelefono(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
