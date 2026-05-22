import { useEffect, useMemo, useRef, useState } from 'react';
import { getJiraShortcutConfig } from './jiraShortcutConfig';

export type UseJiraFloatingButtonResult = {
  isVisible: boolean;
  title: string;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toastOpen: boolean;
  toastMessage: string;
  showToast: (message: string) => void;
  closeToast: () => void;
};

export const useJiraFloatingButton = (): UseJiraFloatingButtonResult => {
  const config = useMemo(() => getJiraShortcutConfig(), []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVisible = config.enabled;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    isVisible,
    title: isVisible ? 'Abrir Jira' : 'Jira no configurado',
    isDialogOpen,
    openDialog: () => setIsDialogOpen(true),
    closeDialog: () => setIsDialogOpen(false),
    toastOpen,
    toastMessage,
    closeToast: () => setToastOpen(false),
    showToast: (message: string) => {
      setToastMessage(message);
      setToastOpen(true);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setToastOpen(false);
        timeoutRef.current = null;
      }, 3000);
    },
  };
};
