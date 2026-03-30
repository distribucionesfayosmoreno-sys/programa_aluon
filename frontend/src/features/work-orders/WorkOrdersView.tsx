import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { useMemo, useState } from 'react';
import { WorkOrdersTabs } from './components/WorkOrdersTabs';
import { WorkOrdersBody } from './components/WorkOrdersBody';
import { useWorkOrdersViewModel } from './hooks/useWorkOrdersViewModel';
import { updateWorkOrderWorkflowStep } from './services/requestsApi';
import AuthorizationDialog from '../../components/feedback/AuthorizationDialog';
import ErrorDialog from '../../components/feedback/ErrorDialog';
import { OriginalRequestDialog } from './components/OriginalRequestDialog';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
  const { dev, onOpenNewRequest } = useWorkOrdersViewModel(ctx);
  const [pendingTab, setPendingTab] = useState<UseWorkOrdersResult['tab'] | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [workflowError, setWorkflowError] = useState('');
  const [navigationWarning, setNavigationWarning] = useState('');
  const [showOriginalRequest, setShowOriginalRequest] = useState(false);

  const selectedRequest = useMemo(
    () => ctx.requests.find(req => req.id === ctx.selectedRequestId) ?? null,
    [ctx.requests, ctx.selectedRequestId],
  );

  const workflowOrder = useMemo<UseWorkOrdersResult['tab'][]>(
    () => ['INBOX', 'REQUEST', 'BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'],
    [],
  );

  const isBackwardTransition = (from: UseWorkOrdersResult['tab'], to: UseWorkOrdersResult['tab']) => (
    workflowOrder.indexOf(to) < workflowOrder.indexOf(from)
  );

  const isForwardTransition = (from: UseWorkOrdersResult['tab'], to: UseWorkOrdersResult['tab']) => (
    workflowOrder.indexOf(to) > workflowOrder.indexOf(from)
  );

  const nextStep = useMemo(() => {
    const currentIndex = workflowOrder.indexOf(ctx.tab);
    if (currentIndex === -1 || currentIndex >= workflowOrder.length - 1) return null;
    return workflowOrder[currentIndex + 1];
  }, [ctx.tab, workflowOrder]);

  const advanceBlockReason = useMemo(() => {
    if (!nextStep) return 'No hay una etapa posterior.';
    if (!ctx.selectedRequestId) return 'Selecciona una solicitud antes de avanzar.';
    switch (nextStep) {
      case 'REQUEST':
        return null;
      case 'BUDGET':
        if (!ctx.customerId || ctx.m2 <= 0 || !ctx.hasModelRef) {
          return 'Completa cliente, m² y referencia del modelo antes de presupuestar.';
        }
        return null;
      case 'VALIDATION':
        if (!ctx.budgetGenerated || !ctx.accountingApproved) {
          return 'Genera el presupuesto y apruébalo en contabilidad antes de validar.';
        }
        return null;
      case 'DEV':
        if (!ctx.adminApproved) {
          return 'El presupuesto debe estar aprobado por ADMIN antes de pasar a desarrollo.';
        }
        return null;
      case 'PROD':
        if (!ctx.developmentGenerated || !ctx.cutlistGenerated) {
          return 'Genera desarrollo y despiece antes de iniciar producción.';
        }
        return null;
      case 'FINAL':
        if (!ctx.prodCut || !ctx.prodFab || !ctx.prodLac || !ctx.prodLacControl) {
          return 'Completa todos los hitos de producción antes de finalizar.';
        }
        return null;
      default:
        return null;
    }
  }, [
    nextStep,
    ctx.selectedRequestId,
    ctx.customerId,
    ctx.m2,
    ctx.hasModelRef,
    ctx.budgetGenerated,
    ctx.accountingApproved,
    ctx.adminApproved,
    ctx.developmentGenerated,
    ctx.cutlistGenerated,
    ctx.prodCut,
    ctx.prodFab,
    ctx.prodLac,
    ctx.prodLacControl,
  ]);

  const persistWorkflowStep = async (nextTab: UseWorkOrdersResult['tab'], authorizerUserId?: string) => {
    if (!ctx.selectedRequestId || ctx.tab === nextTab) return true;
    try {
      await updateWorkOrderWorkflowStep(ctx.selectedRequestId, nextTab, authorizerUserId);
      ctx.setRequests(prev => prev.map(req => (
        req.id === ctx.selectedRequestId ? { ...req, workflowStep: nextTab } : req
      )));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el estado.';
      setWorkflowError(message);
      return false;
    }
  };
  const handleTabChange = async (nextTab: UseWorkOrdersResult['tab']) => {
    if (ctx.tab === 'INBOX' && nextTab !== 'INBOX' && ctx.selectedRequestId) {
      const selectedRequest = ctx.requests.find(req => req.id === ctx.selectedRequestId);
      if (selectedRequest) {
        ctx.applyRequest(selectedRequest);
      }
    }
    if (ctx.selectedRequestId && ctx.tab !== nextTab) {
      if (isForwardTransition(ctx.tab, nextTab)) {
        setNavigationWarning('Para avanzar a una etapa superior usa el botón "Avanzar etapa".');
        return;
      }
      if (isBackwardTransition(ctx.tab, nextTab)) {
        setPendingTab(nextTab);
        setShowAuthDialog(true);
        return;
      }
      const ok = await persistWorkflowStep(nextTab);
      if (!ok) return;
    }
    ctx.setTab(nextTab);
  };

  const handleAuthorize = async (authorizerUserId: string) => {
    if (!pendingTab) return;
    const ok = await persistWorkflowStep(pendingTab, authorizerUserId);
    if (!ok) return;
    ctx.setTab(pendingTab);
    setPendingTab(null);
    setShowAuthDialog(false);
  };

  const handleAdvanceStep = async () => {
    if (advanceBlockReason) {
      setNavigationWarning(advanceBlockReason);
      return;
    }
    if (!nextStep || !ctx.selectedRequestId) return;
    const ok = await persistWorkflowStep(nextStep);
    if (!ok) return;
    ctx.setTab(nextStep);
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <WorkOrdersTabs
        steps={ctx.pipelineSteps}
        activeTab={ctx.tab}
        onTabChange={handleTabChange}
        onOpenNewRequest={onOpenNewRequest}
        onOpenOriginalRequest={() => setShowOriginalRequest(true)}
        canOpenOriginalRequest={Boolean(selectedRequest)}
        onAdvanceStep={handleAdvanceStep}
        canAdvanceStep={Boolean(nextStep && !advanceBlockReason)}
        nextStepLabel={nextStep ? ctx.pipelineSteps.find(step => step.key === nextStep)?.label : undefined}
        advanceHint={advanceBlockReason ?? undefined}
      />
      <WorkOrdersBody ctx={ctx} dev={dev} />

      <AuthorizationDialog
        open={showAuthDialog}
        title="Retroceso de etapa"
        description="Para volver a una etapa anterior se necesita autorización de un usuario con rol ADMIN o DIOS."
        onConfirm={handleAuthorize}
        onClose={() => { setShowAuthDialog(false); setPendingTab(null); }}
      />
      <ErrorDialog
        open={Boolean(workflowError)}
        title="No pudimos cambiar el estado"
        description="La etapa no se actualizó. Revisa la autorización e inténtalo de nuevo."
        detail={workflowError || undefined}
        onClose={() => setWorkflowError('')}
      />
      <ErrorDialog
        open={Boolean(navigationWarning)}
        title="Acción bloqueada"
        description={navigationWarning || ''}
        onClose={() => setNavigationWarning('')}
      />
      <OriginalRequestDialog
        open={showOriginalRequest}
        request={selectedRequest}
        onClose={() => setShowOriginalRequest(false)}
      />
    </div>
  );
};
