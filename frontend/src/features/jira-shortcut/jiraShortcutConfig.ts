export type JiraShortcutConfig = {
  enabled: boolean;
};

const parseBooleanEnv = (value: string | undefined): boolean => value === 'true';

export const getJiraShortcutConfig = (): JiraShortcutConfig => {
  const enabled = parseBooleanEnv(import.meta.env.VITE_JIRA_ENABLED);
  return { enabled };
};
