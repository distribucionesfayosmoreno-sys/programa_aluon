import { useEffect, useMemo, useState } from 'react';
import { navigateToModule } from '../../services/moduleNavigation';
import { setBudgetWizardPrefillCustomerId } from '../budget-wizard/services/budgetWizardPrefill';
import type { ProjectEntity } from '../project-management/ProjectManagement.types';
import { onProjectsChanged } from '../project-management/services/projectEvents';
import { projectStore } from '../project-management/services/projectStore';
import { ensureQuotePdfGenerated, quotePdfUrl } from '../project-management/services/quotePdf';

type ProjectOverviewRow = {
  projectId: string;
  customerName: string;
  customerId: string | null;
  quoteId: string | null;
  quoteNumber: string | null;
  statusLabel: string | null;
  createdAt: string | null;
};

const toRow = (project: ProjectEntity): ProjectOverviewRow => ({
  projectId: project.id,
  customerName: project.customerName,
  customerId: project.customerId ?? null,
  quoteId: project.documents.presupuesto?.quoteId ?? null,
  quoteNumber: project.documents.presupuesto?.quoteNumber ?? null,
  statusLabel: project.documents.presupuesto?.status ?? null,
  createdAt: project.documents.presupuesto?.createdAt ?? project.createdAt,
});

export const useProjectsOverview = () => {
  const [projects, setProjects] = useState<ProjectEntity[]>(() => projectStore.list());
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const refresh = () => setProjects(projectStore.list());
    const unsubscribe = onProjectsChanged(refresh);
    return unsubscribe;
  }, []);

  const rows = useMemo(
    () => projects.map(toRow).sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
    [projects],
  );

  const view = async (projectId: string) => {
    setBusyProjectId(projectId);
    setError('');
    try {
      const project = projectStore.getById(projectId);
      const quoteId = project?.documents.presupuesto?.quoteId;
      if (!quoteId) throw new Error('Este proyecto no tiene presupuesto.');
      await ensureQuotePdfGenerated(quoteId);
      window.open(quotePdfUrl(quoteId), '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el PDF.');
    } finally {
      setBusyProjectId(null);
    }
  };

  const edit = (projectId: string) => {
    const project = projectStore.getById(projectId);
    const customerId = project?.customerId;
    if (customerId) setBudgetWizardPrefillCustomerId(customerId);
    navigateToModule('presupuestos');
  };

  return {
    rows,
    busyProjectId,
    error,
    actions: { view, edit },
  } as const;
};

