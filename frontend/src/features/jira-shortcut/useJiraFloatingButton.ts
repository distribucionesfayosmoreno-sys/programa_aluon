import { useMemo } from 'react';
import { getJiraShortcutConfig } from './jiraShortcutConfig';
import { openExternalUrl } from './jiraShortcutService';

export type UseJiraFloatingButtonResult = {
  isVisible: boolean;
  onClick: () => void;
  title: string;
};

export const useJiraFloatingButton = (): UseJiraFloatingButtonResult => {
  const config = useMemo(() => getJiraShortcutConfig(), []);

  const isVisible = config.enabled && config.openUrl !== null;

  return {
    isVisible,
    title: isVisible ? 'Abrir Jira' : 'Jira no configurado',
    onClick: () => {
      if (!config.enabled || !config.openUrl) return;
      openExternalUrl(config.openUrl);
    },
  };
};

