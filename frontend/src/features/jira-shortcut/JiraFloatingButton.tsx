import type { FC } from 'react';
import type { JiraFloatingButtonProps } from './JiraFloatingButton.types';
import { useJiraFloatingButton } from './useJiraFloatingButton';
import { JiraCreateIssueDialog } from './JiraCreateIssueDialog';
import { getEnvironmentName, getViewportInfo } from './jiraIssueContext';

export const JiraFloatingButton: FC<JiraFloatingButtonProps> = ({ className, moduleKey, moduleLabel }) => {
  const { isVisible, title, isDialogOpen, openDialog, closeDialog } = useJiraFloatingButton();

  if (!isVisible) return null;

  const context = {
    environmentName: getEnvironmentName(),
    moduleKey,
    moduleLabel,
    viewport: getViewportInfo(),
    url: window.location.href,
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        title={title}
        aria-label="Crear ticket en Jira"
        className={[
          'fixed bottom-6 right-6 z-50',
          'h-12 w-12 rounded-2xl',
          'bg-white text-slate-700',
          'border border-slate-200 shadow-sm',
          'hover:bg-slate-50 hover:text-slate-900',
          'active:scale-[0.98] transition',
          'flex items-center justify-center',
          className ?? '',
        ].join(' ')}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
          <path d="M14 6a2 2 0 10-4 0v1H8a1 1 0 000 2h1v2H8a1 1 0 000 2h1v2H8a1 1 0 000 2h2v1a2 2 0 104 0v-1h2a1 1 0 000-2h-1v-2h1a1 1 0 000-2h-1V9h1a1 1 0 000-2h-2V6zM11 6a1 1 0 112 0v1h-2V6zm2 14a1 1 0 11-2 0v-1h2v1zm0-3h-2v-2h2v2zm0-4h-2V9h2v4z" />
        </svg>
      </button>
      <JiraCreateIssueDialog open={isDialogOpen} onClose={closeDialog} context={context} />
    </>
  );
};
