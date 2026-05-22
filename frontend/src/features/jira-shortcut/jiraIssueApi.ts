import type { CreateJiraIssueRequest, CreateJiraIssueResponse } from './jiraIssueApi.types';
import { isCreateJiraIssueResponse } from './jiraIssueApi.types';

export const createJiraIssue = async (request: CreateJiraIssueRequest): Promise<CreateJiraIssueResponse> => {
  const response = await fetch('/api/integrations/jira/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: request.summary,
      description: request.description ?? '',
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Error creando ticket en Jira (${response.status})`);
  }

  const json: unknown = await response.json();
  if (!isCreateJiraIssueResponse(json)) {
    throw new Error('Respuesta inválida del servidor al crear el ticket');
  }
  return json;
};

