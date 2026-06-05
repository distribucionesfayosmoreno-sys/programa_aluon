export type SocialMediaPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'X' | 'TIKTOK';
export type SocialMediaPublicationStatus = 'DRAFT' | 'SCHEDULED' | 'QUEUED' | 'PUBLISHED' | 'FAILED';

export type SocialMediaChannelResponse = {
  id: string;
  platform: SocialMediaPlatform;
  enabled: boolean;
  accountName: string | null;
  accountHandle: string | null;
  profileUrl: string | null;
  captionOverride: string | null;
  hashtags: string | null;
  notes: string | null;
  sortOrder: number;
};

export type SocialMediaPublicationResponse = {
  id: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  status: SocialMediaPublicationStatus;
  scheduledAt: string | null;
  queuedAt: string | null;
  createdAt: string;
  updatedAt: string;
  channels: SocialMediaChannelResponse[];
};

export type SocialMediaChannelForm = {
  platform: SocialMediaPlatform;
  enabled: boolean;
  accountName: string;
  accountHandle: string;
  profileUrl: string;
  captionOverride: string;
  hashtags: string;
  notes: string;
  sortOrder: number;
};

export type SocialMediaPublicationForm = {
  title: string;
  content: string;
  mediaUrl: string;
  scheduledAt: string;
  channels: SocialMediaChannelForm[];
};

export type SocialMediaChannelRequestPayload = {
  platform: SocialMediaPlatform;
  enabled: boolean;
  accountName: string | null;
  accountHandle: string | null;
  profileUrl: string | null;
  captionOverride: string | null;
  hashtags: string | null;
  notes: string | null;
  sortOrder: number;
};

export type SocialMediaPublicationRequestPayload = {
  title: string;
  content: string;
  mediaUrl: string | null;
  scheduledAt: string | null;
  channels: SocialMediaChannelRequestPayload[];
};

export type SocialMediaManagementAction = 'CREATE' | 'EDIT';

export const socialMediaPlatforms: SocialMediaPlatform[] = ['FACEBOOK', 'INSTAGRAM', 'X', 'TIKTOK'];

export const socialMediaPlatformLabels: Record<SocialMediaPlatform, string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  X: 'X',
  TIKTOK: 'TikTok',
};

export const socialMediaPlatformDescriptions: Record<SocialMediaPlatform, string> = {
  FACEBOOK: 'Página y comunidad principal de la empresa.',
  INSTAGRAM: 'Formato visual para fotos, reels y stories.',
  X: 'Mensajes cortos, actualidad y difusión rápida.',
  TIKTOK: 'Vídeo corto para alcance y descubrimiento.',
};

export const createEmptyChannelForm = (platform: SocialMediaPlatform, sortOrder: number): SocialMediaChannelForm => ({
  platform,
  enabled: true,
  accountName: '',
  accountHandle: '',
  profileUrl: '',
  captionOverride: '',
  hashtags: '',
  notes: '',
  sortOrder,
});

export const createEmptyPublicationForm = (): SocialMediaPublicationForm => ({
  title: '',
  content: '',
  mediaUrl: '',
  scheduledAt: '',
  channels: socialMediaPlatforms.map((platform, index) => createEmptyChannelForm(platform, (index + 1) * 10)),
});

export const toPublicationForm = (publication: SocialMediaPublicationResponse | null): SocialMediaPublicationForm => {
  if (!publication) {
    return createEmptyPublicationForm();
  }

  const channelsByPlatform = new Map(publication.channels.map(channel => [channel.platform, channel]));

  return {
    title: publication.title,
    content: publication.content,
    mediaUrl: publication.mediaUrl ?? '',
    scheduledAt: publication.scheduledAt ? toDateTimeLocalValue(publication.scheduledAt) : '',
    channels: socialMediaPlatforms.map((platform, index) => {
      const channel = channelsByPlatform.get(platform);
      return {
        platform,
        enabled: channel?.enabled ?? true,
        accountName: channel?.accountName ?? '',
        accountHandle: channel?.accountHandle ?? '',
        profileUrl: channel?.profileUrl ?? '',
        captionOverride: channel?.captionOverride ?? '',
        hashtags: channel?.hashtags ?? '',
        notes: channel?.notes ?? '',
        sortOrder: channel?.sortOrder ?? (index + 1) * 10,
      };
    }),
  };
};

export const toPublicationRequestPayload = (form: SocialMediaPublicationForm): SocialMediaPublicationRequestPayload => ({
  title: form.title.trim(),
  content: form.content.trim(),
  mediaUrl: form.mediaUrl.trim() || null,
  scheduledAt: form.scheduledAt ? toIsoDateTime(form.scheduledAt) : null,
  channels: form.channels.map(channel => ({
    platform: channel.platform,
    enabled: channel.enabled,
    accountName: channel.accountName.trim() || null,
    accountHandle: channel.accountHandle.trim() || null,
    profileUrl: channel.profileUrl.trim() || null,
    captionOverride: channel.captionOverride.trim() || null,
    hashtags: channel.hashtags.trim() || null,
    notes: channel.notes.trim() || null,
    sortOrder: channel.sortOrder,
  })),
});

export const toDateTimeLocalValue = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (input: number): string => input.toString().padStart(2, '0');

  return [
    date.getFullYear().toString(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
};

export const toIsoDateTime = (value: string): string => new Date(value).toISOString();
