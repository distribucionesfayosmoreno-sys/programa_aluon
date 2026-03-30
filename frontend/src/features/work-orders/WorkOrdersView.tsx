import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { useMemo, useState } from 'react';
import { WorkOrdersTabs } from './components/WorkOrdersTabs';
import { WorkOrdersBody } from './components/WorkOrdersBody';
import { useWorkOrdersViewModel } from './hooks/useWorkOrdersViewModel';
import { updateWorkOrderWorkflowStep } from './services/requestsApi';
import AuthorizationDialog from '../../components/feedback/AuthorizationDialog';
import ErrorDialog from '../../components/feedback/ErrorDialog';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
  const { dev, onOpenNewRequest } = useWorkOrdersViewModel(ctx);
  const [pendingTab, setPendingTab] = useState<UseWorkOrdersResult['tab'] | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [workflowError, setWorkflowError] = useState('');

  const workflowOrder = useMemo<UseWorkOrdersResult['tab'][]>(
    () => ['INBOX', 'REQUEST', 'BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'],
    [],
  );

  const isBackwardTransition = (from: UseWorkOrdersResult['tab'], to: UseWorkOrdersResult['tab']) => (
    workflowOrder.indexOf(to) < workflowOrder.indexOf(from)
  );

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

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <WorkOrdersTabs
        steps={ctx.pipelineSteps}
        activeTab={ctx.tab}
        onTabChange={handleTabChange}
        onOpenNewRequest={onOpenNewRequest}
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
    </div>
  );
};
