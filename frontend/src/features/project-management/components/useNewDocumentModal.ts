import { useEffect, useState } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';
import { createDocumentManagementDocument } from '../services/documentManagementApi';
import type {
  DocumentManagementCreateRequest,
  DocumentManagementCreatableType,
} from '../services/documentManagementApi';
import { searchCustomersByNombreComercial, type CustomerLookupCustomer } from '../services/customerLookupApi';

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
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerLookupCustomer[]>([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchError, setCustomerSearchError] = useState('');

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setError('');
      setCustomerName('');
      setSelectedType('');
      setCustomerSuggestions([]);
      setCustomerSearchLoading(false);
      setCustomerSearchError('');
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const query = customerName.trim();
    if (!query) {
      setCustomerSuggestions([]);
      setCustomerSearchLoading(false);
      setCustomerSearchError('');
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setCustomerSearchLoading(true);
      setCustomerSearchError('');
      void searchCustomersByNombreComercial(query, controller.signal)
        .then((customers) => {
          setCustomerSuggestions(customers);
        })
        .catch((err) => {
          if (controller.signal.aborted) {
            return;
          }
          setCustomerSuggestions([]);
          setCustomerSearchError(err instanceof Error ? err.message : 'No se pudieron buscar clientes.');
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setCustomerSearchLoading(false);
          }
        });
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [customerName, open]);

  const canSubmit = customerName.trim() !== '' && selectedType !== '' && !submitting;

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
      customerSuggestions,
      customerSearchLoading,
      customerSearchError,
    },
    canSubmit,
    actions: {
      setCustomerName,
      setSelectedType,
      submit,
    },
  } as const;
};
