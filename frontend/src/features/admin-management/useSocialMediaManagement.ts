import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type {
  SocialMediaPublicationForm,
  SocialMediaPublicationResponse,
} from './SocialMediaManagement.types';
import {
  createEmptyPublicationForm,
  toPublicationForm,
  toPublicationRequestPayload,
} from './SocialMediaManagement.types';
import {
  createSocialMediaPublication,
  deleteSocialMediaPublication,
  launchSocialMediaPublication,
  listSocialMediaPublications,
  updateSocialMediaPublication,
} from './socialMediaAdminApi';

type UseSocialMediaManagementState = {
  publications: SocialMediaPublicationResponse[];
  loading: boolean;
  saving: boolean;
  error: string;
  isModalOpen: boolean;
  selectedPublication: SocialMediaPublicationResponse | null;
  form: SocialMediaPublicationForm;
  openCreate: () => void;
  openEdit: (publication: SocialMediaPublicationResponse) => void;
  closeModal: () => void;
  setForm: Dispatch<SetStateAction<SocialMediaPublicationForm>>;
  savePublication: (publicationForm?: SocialMediaPublicationForm) => Promise<void>;
  removePublication: (publicationId: string) => Promise<void>;
  queuePublication: (publicationId: string) => Promise<void>;
  reload: () => Promise<void>;
};

export const useSocialMediaManagement = (): UseSocialMediaManagementState => {
  const [publications, setPublications] = useState<SocialMediaPublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<SocialMediaPublicationResponse | null>(null);
  const [form, setForm] = useState<SocialMediaPublicationForm>(createEmptyPublicationForm());

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSocialMediaPublications();
      setPublications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const openCreate = () => {
    setSelectedPublication(null);
    setForm(createEmptyPublicationForm());
    setIsModalOpen(true);
  };

  const openEdit = (publication: SocialMediaPublicationResponse) => {
    setSelectedPublication(publication);
    setForm(toPublicationForm(publication));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const savePublication = async (publicationForm: SocialMediaPublicationForm = form) => {
    setSaving(true);
    setError('');
    try {
      const payload = toPublicationRequestPayload(publicationForm);
      if (selectedPublication) {
        await updateSocialMediaPublication(selectedPublication.id, payload);
      } else {
        await createSocialMediaPublication(payload);
      }
      setIsModalOpen(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la publicación');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removePublication = async (publicationId: string) => {
    setSaving(true);
    setError('');
    try {
      await deleteSocialMediaPublication(publicationId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la publicación');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const queuePublication = async (publicationId: string) => {
    setSaving(true);
    setError('');
    try {
      await launchSocialMediaPublication(publicationId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al lanzar la publicación');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
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
    reload,
  };
};
