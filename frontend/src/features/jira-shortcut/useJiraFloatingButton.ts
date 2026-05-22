import { useMemo, useState } from 'react';
import { getJiraShortcutConfig } from './jiraShortcutConfig';

export type UseJiraFloatingButtonResult = {
  isVisible: boolean;
  title: string;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export const useJiraFloatingButton = (): UseJiraFloatingButtonResult => {
  const config = useMemo(() => getJiraShortcutConfig(), []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isVisible = config.enabled;

  return {
    isVisible,
    title: isVisible ? 'Abrir Jira' : 'Jira no configurado',
    isDialogOpen,
    openDialog: () => setIsDialogOpen(true),
    closeDialog: () => setIsDialogOpen(false),
  };
};
