import type {
  SocialMediaPublicationRequestPayload,
  SocialMediaPublicationResponse,
} from './SocialMediaManagement.types';

const jsonHeaders = { 'Content-Type': 'application/json' };

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const listSocialMediaPublications = async (): Promise<SocialMediaPublicationResponse[]> => {
  const response = await fetch('/api/admin/social-media/publications');
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as SocialMediaPublicationResponse[];
};

export const getSocialMediaPublication = async (publicationId: string): Promise<SocialMediaPublicationResponse> => {
  const response = await fetch(`/api/admin/social-media/publications/${encodeURIComponent(publicationId)}`);
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as SocialMediaPublicationResponse;
};

export const createSocialMediaPublication = async (
  payload: SocialMediaPublicationRequestPayload,
): Promise<SocialMediaPublicationResponse> => {
  const response = await fetch('/api/admin/social-media/publications', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as SocialMediaPublicationResponse;
};

export const updateSocialMediaPublication = async (
  publicationId: string,
  payload: SocialMediaPublicationRequestPayload,
): Promise<SocialMediaPublicationResponse> => {
  const response = await fetch(`/api/admin/social-media/publications/${encodeURIComponent(publicationId)}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as SocialMediaPublicationResponse;
};

export const launchSocialMediaPublication = async (publicationId: string): Promise<SocialMediaPublicationResponse> => {
  const response = await fetch(`/api/admin/social-media/publications/${encodeURIComponent(publicationId)}/launch`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as SocialMediaPublicationResponse;
};

export const deleteSocialMediaPublication = async (publicationId: string): Promise<void> => {
  const response = await fetch(`/api/admin/social-media/publications/${encodeURIComponent(publicationId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
};
