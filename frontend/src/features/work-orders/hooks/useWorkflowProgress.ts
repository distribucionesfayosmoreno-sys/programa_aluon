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
  allStationsCompleted: boolean;
  stationCompletedCount: number;
  stationTotalCount: number;
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
  allStationsCompleted,
  stationCompletedCount,
  stationTotalCount,
  finalized,
  ready,
  selectedRequestId,
}: WorkflowProgressParams) => {
  const productionPct = stationTotalCount > 0
    ? Math.round((stationCompletedCount / stationTotalCount) * 100)
    : 0;

  const overallPct = useMemo(() => {
    const checks = [
      Boolean(customerId) && m2 > 0 && hasModelRef,
      budgetGenerated,
      accountingApproved,
      adminApproved,
      developmentGenerated,
      cutlistGenerated,
      allStationsCompleted,
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
    allStationsCompleted,
    finalized,
    ready,
  ]);

  const canStartProduction = budgetGenerated && accountingApproved && adminApproved && developmentGenerated && cutlistGenerated;
  const canFinalize = canStartProduction && allStationsCompleted;

  const resolveWorkflowStep = (): TabKey => {
    if (finalized && ready !== '') return 'FINAL';
    if (allStationsCompleted) return 'PROD';
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
    { key: 'PROD', label: 'Producción', done: allStationsCompleted },
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
