import { useCallback, useMemo, useState } from 'react';
import { createJiraIssue } from './jiraIssueApi';
import { openExternalUrl } from './jiraShortcutService';
import type { JiraIssueContext } from './jiraIssueContext.types';
import { formatContextMarkdown } from './jiraIssueContext';

export type UseJiraCreateIssueDialogResult = {
  summary: string;
  description: string;
  attachments: File[];
  setSummary: (value: string) => void;
  setDescription: (value: string) => void;
  setAttachments: (files: File[]) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  errorMessage: string | null;
  submit: () => Promise<void>;
};

export const useJiraCreateIssueDialog = (
  onClose: () => void,
  context: JiraIssueContext,
): UseJiraCreateIssueDialogResult => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => summary.trim().length > 0 && !isSubmitting, [summary, isSubmitting]);

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const enrichedDescription = [
        description.trim(),
        formatContextMarkdown(context),
      ].join('\n');

      const result = await createJiraIssue({
        summary: summary.trim(),
        description: enrichedDescription,
        attachments,
      });
      openExternalUrl(new URL(result.browseUrl));
      onClose();
      setSummary('');
      setDescription('');
      setAttachments([]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error creando el ticket';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, summary, description, onClose, context, attachments]);

  return {
    summary,
    description,
    attachments,
    setSummary,
    setDescription,
    setAttachments,
    isSubmitting,
    canSubmit,
    errorMessage,
    submit,
  };
};
