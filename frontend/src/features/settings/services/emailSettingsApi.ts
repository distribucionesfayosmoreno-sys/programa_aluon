import type { EmailSignature, EmailTemplate } from '../models';

type CreateSignaturePayload = {
  fullName: string;
  role: string | null;
  phone: string | null;
  email: string;
  website: string | null;
  address: string | null;
  logoUrl: string | null;
  accentColor: string | null;
};

type UpdateTemplatePayload = {
  templateKey: string;
  subject: string;
  bodyHtml: string;
};

type SendTestPayload = {
  templateKey: string;
  to: string;
  nombreComercial: string;
  email: string;
  telefono: string;
};

export const getEmailSignatures = async () => {
  const response = await fetch('/api/settings/email-signatures');
  if (!response.ok) {
    throw new Error('No se pudieron cargar las firmas');
  }
  return (await response.json()) as EmailSignature[];
};

export const createEmailSignature = async (payload: CreateSignaturePayload) => {
  const response = await fetch('/api/settings/email-signatures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo generar la firma');
  }

  return (await response.json()) as EmailSignature;
};

export const getEmailTemplates = async () => {
  const response = await fetch('/api/settings/email-templates');
  if (!response.ok) {
    throw new Error('No se pudieron cargar las plantillas');
  }
  return (await response.json()) as EmailTemplate[];
};

export const updateEmailTemplate = async (templateId: string, payload: UpdateTemplatePayload) => {
  const response = await fetch(`/api/settings/email-templates/${templateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('No se pudo guardar la plantilla');
  }
  return (await response.json()) as EmailTemplate;
};

export const sendEmailTemplateTest = async (payload: SendTestPayload) => {
  const response = await fetch('/api/settings/email-templates/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('No se pudo enviar el correo de prueba');
  }
};
