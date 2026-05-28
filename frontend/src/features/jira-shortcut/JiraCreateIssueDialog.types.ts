import type { JiraIssueContext } from './jiraIssueContext.types';

export type JiraCreateIssueDialogProps = {
  open: boolean;
  onClose: () => void;
  context: JiraIssueContext;
  onCreated: () => void;
};
