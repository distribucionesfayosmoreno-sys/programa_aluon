import { useEffect, useState } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import { createDocumentManagementDocument } from '../services/documentManagementApi';
import type {
  DocumentManagementCreateRequest,
  DocumentManagementCreatableType,
} from '../services/documentManagementApi';

type UseNewDocumentModalParams = {
  open: boolean;
  onCreate?: (payload: DocumentManagementCreateRequest) => Promise<ProjectDocumentRow>;
  onCreated: (row: ProjectDocumentRow) => void;
};

export const useNewDocumentModal = ({
  open,
  onCreate,
  onCreated,
}: UseNewDocumentModalParams) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentManagementCreatableType | ''>('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setError('');
      setCustomerName('');
      setSelectedType('');
      setNumber('');
      return;
    }
  }, [open]);

  const canSubmit = customerName.trim() !== '' && selectedType !== '' && number.trim() !== '' && !submitting;

  const submit = async () => {
    if (!canSubmit) {
      return;
    }

    const create = onCreate ?? createDocumentManagementDocument;

    try {
      setSubmitting(true);
      setError('');
      const created = await create({
        customerName: customerName.trim(),
        type: selectedType,
        number: number.trim(),
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el documento.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      submitting,
      error,
      customerName,
      selectedType,
      number,
    },
    canSubmit,
    actions: {
      setCustomerName,
      setSelectedType,
      setNumber,
      submit,
    },
  } as const;
};
