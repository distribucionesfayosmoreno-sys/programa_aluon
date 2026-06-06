import type { WhatsappTemplate } from '../models';

type UpsertWhatsappTemplatePayload = {
  templateKey: string;
  messageText: string;
};

export const getWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  const response = await fetch('/api/settings/whatsapp-messages');
  if (!response.ok) {
    throw new Error('No se pudieron cargar los mensajes de WhatsApp');
  }
  return (await response.json()) as WhatsappTemplate[];
};

export const updateWhatsappTemplate = async (templateId: string, payload: UpsertWhatsappTemplatePayload): Promise<WhatsappTemplate> => {
  const response = await fetch(`/api/settings/whatsapp-messages/${templateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo guardar el mensaje de WhatsApp');
  }

  return (await response.json()) as WhatsappTemplate;
};
