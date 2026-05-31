import { useEffect, useMemo, useState } from 'react';
import type { ProjectDocumentRow, ProjectEntity, WorkOrderWorkflowStep } from './ProjectManagement.types';
import { onProjectsChanged } from './services/projectEvents';
import { fetchOrderStatuses } from './services/ordersApi';
import { validateQuote } from './services/quotesApi';
import { projectStore } from './services/projectStore';
import { ensureQuotePdfGenerated, quotePdfUrl } from './services/quotePdf';
import { navigateToModule } from '../../services/moduleNavigation';
import { setBudgetWizardPrefillCustomerId } from '../budget-wizard/services/budgetWizardPrefill';

const toDocumentRows = (project: ProjectEntity): ProjectDocumentRow[] => {
  const rows: ProjectDocumentRow[] = [];

  if (project.documents.presupuesto) {
    rows.push({
      rowId: `${project.id}:PRESUPUESTO`,
      projectId: project.id,
      customerName: project.customerName,
      type: 'PRESUPUESTO',
      number: project.documents.presupuesto.quoteNumber,
      statusLabel: project.documents.presupuesto.status,
      createdAt: project.documents.presupuesto.createdAt,
    });
  }

  if (project.documents.pedido) {
    rows.push({
      rowId: `${project.id}:PEDIDO`,
      projectId: project.id,
      customerName: project.customerName,
      type: 'PEDIDO',
      number: project.documents.pedido.orderNumber,
      statusLabel: project.documents.pedido.status,
      createdAt: project.documents.pedido.createdAt,
      workOrderStep: project.workOrder?.workflowStep,
    });
  }

  if (project.documents.albaran) {
    rows.push({
      rowId: `${project.id}:ALBARAN`,
      projectId: project.id,
      customerName: project.customerName,
      type: 'ALBARAN',
      number: project.documents.albaran.deliveryNoteNumber,
      statusLabel: project.documents.albaran.status,
      createdAt: project.documents.albaran.createdAt,
    });
  }

  if (project.documents.factura) {
    rows.push({
      rowId: `${project.id}:FACTURA`,
      projectId: project.id,
      customerName: project.customerName,
      type: 'FACTURA',
      number: project.documents.factura.invoiceNumber,
      statusLabel: project.documents.factura.status,
      createdAt: project.documents.factura.createdAt,
    });
  }

  if (project.documents.abono) {
    rows.push({
      rowId: `${project.id}:ABONO`,
      projectId: project.id,
      customerName: project.customerName,
      type: 'ABONO',
      number: project.documents.abono.creditNoteNumber,
      statusLabel: project.documents.abono.status,
      createdAt: project.documents.abono.createdAt,
    });
  }

  return rows;
};

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<ProjectEntity[]>(() => projectStore.list());
  const [orderDocs, setOrderDocs] = useState<ProjectDocumentRow[]>([]);
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const refresh = () => setProjects(projectStore.list());
    const unsubscribe = onProjectsChanged(refresh);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      try {
        const orders = await fetchOrderStatuses();
        if (cancelled) return;
        const mapped: ProjectDocumentRow[] = orders.map(order => ({
          rowId: `order:${order.id}`,
          projectId: `order:${order.id}`,
          customerName: order.customerName,
          type: 'PEDIDO',
          number: order.codigoOrden,
          statusLabel: order.estado,
          createdAt: (order.requestDate ?? new Date().toISOString()).slice(0, 10),
          workOrderStep: (order.workflowStage as WorkOrderWorkflowStep)
            ?? (order.workflowStep as WorkOrderWorkflowStep)
            ?? undefined,
        }));
        setOrderDocs(mapped);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudieron cargar las órdenes de trabajo.');
        }
      }
    };
    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      [...projects.flatMap(toDocumentRows), ...orderDocs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [projects, orderDocs],
  );

  const approveBudget = async (projectId: string) => {
    setBusyProjectId(projectId);
    setError('');
    try {
      const project = projects.find(item => item.id === projectId);
      const quoteId = project?.documents.presupuesto?.quoteId;
      if (!quoteId) throw new Error('El proyecto no tiene presupuesto.');

      const validated = await validateQuote(quoteId);
      projectStore.upsertFromQuote(validated);
      projectStore.approveQuoteToOrder(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar el presupuesto.');
    } finally {
      setBusyProjectId(null);
    }
  };

  const markWorkOrderStep = (projectId: string, step: WorkOrderWorkflowStep) => {
    projectStore.updateWorkOrderStep(projectId, step);
  };

  const finalizeToDeliveryNote = (projectId: string) => {
    projectStore.finalizeWorkOrderToDeliveryNote(projectId);
  };

  const invoice = (projectId: string) => {
    projectStore.invoiceFromDeliveryNote(projectId);
  };

  const creditNote = (projectId: string) => {
    projectStore.createCreditNote(projectId);
  };

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
    projects,
    busyProjectId,
    error,
    actions: {
      approveBudget,
      markWorkOrderStep,
      finalizeToDeliveryNote,
      invoice,
      creditNote,
      view,
      edit,
    },
  } as const;
};
