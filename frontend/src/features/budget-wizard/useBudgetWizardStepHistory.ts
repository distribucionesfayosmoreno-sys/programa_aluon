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

export const useBudgetWizardStepHistory = () => {
  const [step, setStepState] = useState<Step>('MODELO');
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const syncStepFromHistory = () => {
      const params = new URLSearchParams(window.location.search);
      const urlStep = params.get('step');
      const parsedStep = isStep(urlStep) ? urlStep : 'MODELO';

      if (!urlStep || !isStep(urlStep)) {
        params.set('step', parsedStep);
        window.history.replaceState(
          { ...(window.history.state ?? {}), budgetWizardStep: parsedStep },
          '',
          `${window.location.pathname}?${params.toString()}${window.location.hash}`,
        );
      }

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
    const params = new URLSearchParams(window.location.search);
    params.set('step', nextStep);
    window.history.pushState(
      { ...(window.history.state ?? {}), budgetWizardStep: nextStep },
      '',
      `${window.location.pathname}?${params.toString()}${window.location.hash}`,
    );
  };

  return { step, setStep };
};
