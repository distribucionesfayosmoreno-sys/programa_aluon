import type { FC } from 'react';
import type { JiraFloatingButtonProps } from './JiraFloatingButton.types';
import { useJiraFloatingButton } from './useJiraFloatingButton';

export const JiraFloatingButton: FC<JiraFloatingButtonProps> = ({ className }) => {
  const { isVisible, onClick, title } = useJiraFloatingButton();

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label="Abrir Jira"
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
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    </button>
  );
};

