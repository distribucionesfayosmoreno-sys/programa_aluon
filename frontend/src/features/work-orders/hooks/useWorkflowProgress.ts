import { useMemo } from 'react';
import type { TabKey } from '../models';

type WorkflowProgressParams = {
  customerId: string;
  m2: number;
  hasModelRef: boolean;
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  developmentGenerated: boolean;
  cutlistGenerated: boolean;
  prodCut: boolean;
  prodFab: boolean;
  prodLac: boolean;
  prodLacControl: boolean;
  finalized: boolean;
  ready: '' | 'PICKUP' | 'SHIPPING';
  selectedRequestId: string | null;
};

export const useWorkflowProgress = ({
  customerId,
  m2,
  hasModelRef,
  budgetGenerated,
  accountingApproved,
  adminApproved,
  developmentGenerated,
  cutlistGenerated,
  prodCut,
  prodFab,
  prodLac,
  prodLacControl,
  finalized,
  ready,
  selectedRequestId,
}: WorkflowProgressParams) => {
  const productionSteps = [prodCut, prodFab, prodLac, prodLacControl];
  const productionPct = Math.round((productionSteps.filter(Boolean).length / productionSteps.length) * 100);

  const overallPct = useMemo(() => {
    const checks = [
      Boolean(customerId) && m2 > 0 && hasModelRef,
      budgetGenerated,
      accountingApproved,
      adminApproved,
      developmentGenerated,
      cutlistGenerated,
      prodCut,
      prodFab,
      prodLac,
      prodLacControl,
      finalized,
      ready !== '',
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [
    customerId,
    m2,
    hasModelRef,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    developmentGenerated,
    cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
  ]);

  const canStartProduction = budgetGenerated && accountingApproved && adminApproved && developmentGenerated && cutlistGenerated;
  const canFinalize = canStartProduction && prodCut && prodFab && prodLac && prodLacControl;

  const resolveWorkflowStep = (): TabKey => {
    if (finalized && ready !== '') return 'FINAL';
    if (prodCut && prodFab && prodLac && prodLacControl) return 'PROD';
    if (developmentGenerated && cutlistGenerated) return 'DEV';
    if (adminApproved) return 'VALIDATION';
    if (budgetGenerated && accountingApproved) return 'BUDGET';
    if (Boolean(customerId) && m2 > 0 && hasModelRef) return 'REQUEST';
    return 'INBOX';
  };

  const pipelineSteps: Array<{ key: TabKey; label: string; done: boolean }> = [
    { key: 'INBOX', label: 'Solicitudes', done: selectedRequestId !== null },
    { key: 'REQUEST', label: 'Solicitud', done: Boolean(customerId) && m2 > 0 && hasModelRef },
    { key: 'BUDGET', label: 'Presupuesto', done: budgetGenerated && accountingApproved },
    { key: 'VALIDATION', label: 'Validación ptos', done: adminApproved },
    { key: 'DEV', label: 'Desarrollo', done: developmentGenerated && cutlistGenerated },
    { key: 'PROD', label: 'Producción', done: prodCut && prodFab && prodLac && prodLacControl },
    { key: 'FINAL', label: 'Finalización', done: finalized && ready !== '' },
  ];

  return {
    productionPct,
    overallPct,
    canStartProduction,
    canFinalize,
    pipelineSteps,
    resolveWorkflowStep,
  };
};

export type UseWorkflowProgressResult = ReturnType<typeof useWorkflowProgress>;
