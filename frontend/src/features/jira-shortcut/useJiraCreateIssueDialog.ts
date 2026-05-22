import { useCallback, useMemo, useState } from 'react';
import { createJiraIssue } from './jiraIssueApi';
import { openExternalUrl } from './jiraShortcutService';

export type UseJiraCreateIssueDialogResult = {
  summary: string;
  description: string;
  setSummary: (value: string) => void;
  setDescription: (value: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  errorMessage: string | null;
  submit: () => Promise<void>;
};

export const useJiraCreateIssueDialog = (onClose: () => void): UseJiraCreateIssueDialogResult => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => summary.trim().length > 0 && !isSubmitting, [summary, isSubmitting]);

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await createJiraIssue({ summary: summary.trim(), description: description.trim() });
      openExternalUrl(new URL(result.browseUrl));
      onClose();
      setSummary('');
      setDescription('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error creando el ticket';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, summary, description, onClose]);

  return {
    summary,
    description,
    setSummary,
    setDescription,
    isSubmitting,
    canSubmit,
    errorMessage,
    submit,
  };
};

