import { useState } from 'react';
import AppDialog from '../../components/feedback/AppDialog';
import type {
  SocialMediaPublicationForm,
  SocialMediaPublicationResponse,
} from './SocialMediaManagement.types';
import { SocialMediaChannelSection } from './SocialMediaChannelSection';

type Props = {
  publication: SocialMediaPublicationResponse | null;
  form: SocialMediaPublicationForm;
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: SocialMediaPublicationForm) => Promise<void>;
  onChange: (updater: (current: SocialMediaPublicationForm) => SocialMediaPublicationForm) => void;
};

export const SocialMediaPublicationModal = ({ publication, form, saving, onClose, onSubmit, onChange }: Props) => {
  const [submitting, setSubmitting] = useState(false);

  const updateChannel = (platform: SocialMediaPublicationForm['channels'][number]['platform']) => (
    patch: Partial<SocialMediaPublicationForm['channels'][number]>
  ) => {
    onChange(current => ({
      ...current,
      channels: current.channels.map(channel => (
        channel.platform === platform ? { ...channel, ...patch } : channel
      )),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const title = publication ? 'Editar publicación RRSS' : 'Nueva publicación RRSS';

  return (
    <AppDialog
      open={true}
      title={title}
      subtitle="Configura la publicación compartida y los ajustes por canal."
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
      actions={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="social-media-publication-form" className="btn-primary" disabled={saving || submitting}>
            {saving || submitting ? 'Guardando...' : 'Guardar publicación'}
          </button>
        </>
      }
    >
      <form id="social-media-publication-form" onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="field-label">Titulo *</label>
              <input
                className="field w-full"
                value={form.title}
                onChange={event => onChange(current => ({ ...current, title: event.target.value }))}
                placeholder="Campana comercial de la semana"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Contenido *</label>
              <textarea
                className="field w-full min-h-28"
                value={form.content}
                onChange={event => onChange(current => ({ ...current, content: event.target.value }))}
                placeholder="Texto base compartido entre redes"
                required
              />
            </div>
            <div>
              <label className="field-label">Media URL</label>
              <input
                className="field w-full"
                value={form.mediaUrl}
                onChange={event => onChange(current => ({ ...current, mediaUrl: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="field-label">Programacion</label>
              <input
                className="field w-full"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={event => onChange(current => ({ ...current, scheduledAt: event.target.value }))}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-slate-800">Configuracion por red</div>
            <p className="mt-1 text-xs text-slate-500">Cada bloque es independiente y se enviara junto a la publicacion.</p>
          </div>
          <div className="space-y-4">
            {form.channels.map(channel => (
              <SocialMediaChannelSection
                key={channel.platform}
                channel={channel}
                onChange={updateChannel(channel.platform)}
              />
            ))}
          </div>
        </section>
      </form>
    </AppDialog>
  );
};
