export type JiraShortcutConfig = {
  enabled: boolean;
  openUrl: URL | null;
};

const parseBooleanEnv = (value: string | undefined): boolean => value === 'true';

const parseUrlEnv = (value: string | undefined): URL | null => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export const getJiraShortcutConfig = (): JiraShortcutConfig => {
  const enabled = parseBooleanEnv(import.meta.env.VITE_JIRA_ENABLED);
  const openUrl = parseUrlEnv(import.meta.env.VITE_JIRA_OPEN_URL);

  if (!enabled) return { enabled: false, openUrl: null };
  return { enabled: true, openUrl };
};

