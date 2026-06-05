import { useState } from 'react';
import { SocialMediaPublicationModal } from './SocialMediaPublicationModal';
import { socialMediaPlatformLabels } from './SocialMediaManagement.types';
import type { SocialMediaPublicationResponse } from './SocialMediaManagement.types';
import type { SocialMediaPublicationForm } from './SocialMediaManagement.types';
import { useSocialMediaManagement } from './useSocialMediaManagement';

const formatDateTime = (value: string | null): string => {
  if (!value) {
    return 'Sin programacion';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Fecha invalida';
  }
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PublicationCard = ({
  publication,
  onEdit,
  onDelete,
  onLaunch,
  busy,
}: {
  publication: SocialMediaPublicationResponse;
  onEdit: (publication: SocialMediaPublicationResponse) => void;
  onDelete: (publicationId: string) => void;
  onLaunch: (publicationId: string) => void;
  busy: boolean;
}) => {
  const statusStyles: Record<SocialMediaPublicationResponse['status'], { background: string; color: string }> = {
    DRAFT: { background: '#f8fafc', color: '#475569' },
    SCHEDULED: { background: '#eff6ff', color: '#1d4ed8' },
    QUEUED: { background: '#fef3c7', color: '#92400e' },
    PUBLISHED: { background: '#dcfce7', color: '#166534' },
    FAILED: { background: '#fee2e2', color: '#b91c1c' },
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 truncate">{publication.title}</h3>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={statusStyles[publication.status]}
            >
              {publication.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600" style={{ maxHeight: 54, overflow: 'hidden' }}>
            {publication.content}
          </p>
        </div>
        <div className="text-[11px] text-slate-500 text-right whitespace-nowrap">
          <div>{formatDateTime(publication.scheduledAt)}</div>
          <div className="mt-1">{publication.queuedAt ? `En cola: ${formatDateTime(publication.queuedAt)}` : 'No lanzada'}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {publication.channels.map(channel => (
          <span
            key={channel.id}
            className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              borderColor: channel.enabled ? '#cbd5e1' : '#e2e8f0',
              background: channel.enabled ? '#f8fafc' : '#fff',
              color: channel.enabled ? '#0f172a' : '#94a3b8',
            }}
          >
            {socialMediaPlatformLabels[channel.platform]}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={() => onEdit(publication)} disabled={busy}>
          Editar
        </button>
        <button type="button" className="btn-ghost" onClick={() => onLaunch(publication.id)} disabled={busy}>
          Lanzar
        </button>
        <button type="button" className="btn-ghost" onClick={() => onDelete(publication.id)} disabled={busy}>
          Eliminar
        </button>
      </div>
    </article>
  );
};

const SocialMediaManagement = () => {
  const {
    publications,
    loading,
    saving,
    error,
    isModalOpen,
    selectedPublication,
    form,
    openCreate,
    openEdit,
    closeModal,
    setForm,
    savePublication,
    removePublication,
    queuePublication,
  } = useSocialMediaManagement();
  const [localSavingId, setLocalSavingId] = useState<string | null>(null);

  const handleSave = async (publicationForm: SocialMediaPublicationForm) => {
    await savePublication(publicationForm);
  };

  const handleDelete = async (publicationId: string) => {
    setLocalSavingId(publicationId);
    try {
      await removePublication(publicationId);
    } finally {
      setLocalSavingId(null);
    }
  };

  const handleLaunch = async (publicationId: string) => {
    setLocalSavingId(publicationId);
    try {
      await queuePublication(publicationId);
    } finally {
      setLocalSavingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-wider" style={{ color: '#111827' }}>
            Publicaciones RRSS
          </div>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Configura publicaciones compartidas y ajusta cada red social por separado.
          </p>
        </div>

        <button className="btn-primary" onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva publicacion
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto pr-1">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
            Cargando publicaciones...
          </div>
        ) : publications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Aun no hay publicaciones configuradas.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {publications.map(publication => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                onEdit={openEdit}
                onDelete={handleDelete}
                onLaunch={handleLaunch}
                busy={saving || localSavingId === publication.id}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SocialMediaPublicationModal
          publication={selectedPublication}
          form={form}
          saving={saving}
          onClose={closeModal}
          onSubmit={handleSave}
          onChange={updater => setForm(updater)}
        />
      )}
    </div>
  );
};

export default SocialMediaManagement;
