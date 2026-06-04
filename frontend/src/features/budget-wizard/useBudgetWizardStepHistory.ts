import { useEffect, useRef, useState } from 'react';
import type { Step } from './BudgetWizard.types';

const isStep = (value: string | null): value is Step =>
  value === 'MODELO'
  || value === 'PRODUCTO'
  || value === 'COLOR'
  || value === 'APERTURA'
  || value === 'MEDIDAS'
  || value === 'CLIENTE'
  || value === 'RESUMEN'
  || value === 'ACCIONES'
  || value === 'FINALIZADO';

const isHistoryStateRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readStepFromHistory = (): Step => {
  const historyState = window.history.state;
  if (isHistoryStateRecord(historyState) && isStep(typeof historyState.budgetWizardStep === 'string' ? historyState.budgetWizardStep : null)) {
    return historyState.budgetWizardStep as Step;
  }

  return 'MODELO';
};

export const useBudgetWizardStepHistory = () => {
  const [step, setStepState] = useState<Step>('MODELO');
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const syncStepFromHistory = () => {
      const parsedStep = readStepFromHistory();
      window.history.replaceState(
        { ...(isHistoryStateRecord(window.history.state) ? window.history.state : {}), budgetWizardStep: parsedStep },
        '',
        `${window.location.pathname}${window.location.hash}`,
      );

      if (parsedStep !== stepRef.current) {
        setStepState(parsedStep);
      }
    };

    syncStepFromHistory();
    window.addEventListener('popstate', syncStepFromHistory);
    return () => window.removeEventListener('popstate', syncStepFromHistory);
  }, []);

  const setStep = (nextStep: Step) => {
    if (nextStep === stepRef.current) {
      return;
    }
    setStepState(nextStep);
    window.history.pushState(
      { ...(isHistoryStateRecord(window.history.state) ? window.history.state : {}), budgetWizardStep: nextStep },
      '',
      `${window.location.pathname}${window.location.hash}`,
    );
  };

  return { step, setStep };
};
