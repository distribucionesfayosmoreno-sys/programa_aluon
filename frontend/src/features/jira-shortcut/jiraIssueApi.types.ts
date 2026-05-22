export type CreateJiraIssueRequest = {
  summary: string;
  description?: string;
};

export type CreateJiraIssueResponse = {
  key: string;
  self: string;
  browseUrl: string;
};

export const isCreateJiraIssueResponse = (value: unknown): value is CreateJiraIssueResponse => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.key === 'string' &&
    typeof record.self === 'string' &&
    typeof record.browseUrl === 'string'
  );
};

