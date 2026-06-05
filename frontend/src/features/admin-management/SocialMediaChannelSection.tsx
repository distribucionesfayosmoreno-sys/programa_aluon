import type { SocialMediaChannelForm } from './SocialMediaManagement.types';
import { socialMediaPlatformDescriptions, socialMediaPlatformLabels } from './SocialMediaManagement.types';

type Props = {
  channel: SocialMediaChannelForm;
  onChange: (patch: Partial<SocialMediaChannelForm>) => void;
};

export const SocialMediaChannelSection = ({ channel, onChange }: Props) => {
  const label = socialMediaPlatformLabels[channel.platform];

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-800">{label}</div>
          <p className="mt-1 text-[11px] text-slate-500">{socialMediaPlatformDescriptions[channel.platform]}</p>
        </div>
        <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={channel.enabled}
            onChange={event => onChange({ enabled: event.target.checked })}
          />
          Activa
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Cuenta</label>
          <input
            className="field w-full"
            value={channel.accountName}
            onChange={event => onChange({ accountName: event.target.value })}
            placeholder="Nombre visible"
          />
        </div>
        <div>
          <label className="field-label">Handle</label>
          <input
            className="field w-full"
            value={channel.accountHandle}
            onChange={event => onChange({ accountHandle: event.target.value })}
            placeholder="@aluon"
          />
        </div>
        <div>
          <label className="field-label">URL del perfil</label>
          <input
            className="field w-full"
            value={channel.profileUrl}
            onChange={event => onChange({ profileUrl: event.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="field-label">Orden</label>
          <input
            className="field w-full"
            type="number"
            value={channel.sortOrder}
            onChange={event => onChange({ sortOrder: Number(event.target.value) || 0 })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Caption personalizada</label>
          <textarea
            className="field w-full min-h-24"
            value={channel.captionOverride}
            onChange={event => onChange({ captionOverride: event.target.value })}
            placeholder="Texto adaptado al canal"
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Hashtags</label>
          <input
            className="field w-full"
            value={channel.hashtags}
            onChange={event => onChange({ hashtags: event.target.value })}
            placeholder="#aluon #cerrajeria"
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Notas internas</label>
          <textarea
            className="field w-full min-h-20"
            value={channel.notes}
            onChange={event => onChange({ notes: event.target.value })}
            placeholder="Observaciones internas del equipo"
          />
        </div>
      </div>
    </section>
  );
};
