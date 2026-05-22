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
          'h-14 w-14 rounded-full',
          'bg-red-600 text-white',
          'shadow-md',
          'hover:bg-red-700',
          'active:scale-[0.98] transition',
          'flex items-center justify-center',
          className ?? '',
        ].join(' ')}
      >
        <span className="text-2xl leading-none" aria-hidden="true">🐞</span>
      </button>
      <JiraCreateIssueDialog open={isDialogOpen} onClose={closeDialog} context={context} />
    </>
  );
};
