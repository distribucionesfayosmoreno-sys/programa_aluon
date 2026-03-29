import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { WorkOrdersTabs } from './components/WorkOrdersTabs';
import { WorkOrdersBody } from './components/WorkOrdersBody';
import { useWorkOrdersViewModel } from './hooks/useWorkOrdersViewModel';
import { updateWorkOrderWorkflowStep } from './services/requestsApi';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
  const { dev, onOpenNewRequest } = useWorkOrdersViewModel(ctx);
  const handleTabChange = async (nextTab: UseWorkOrdersResult['tab']) => {
    if (ctx.tab === 'INBOX' && nextTab !== 'INBOX' && ctx.selectedRequestId) {
      const selectedRequest = ctx.requests.find(req => req.id === ctx.selectedRequestId);
      if (selectedRequest) {
        ctx.applyRequest(selectedRequest);
      }
    }
    if (ctx.selectedRequestId && ctx.tab === 'REQUEST' && nextTab === 'BUDGET') {
      try {
        await updateWorkOrderWorkflowStep(ctx.selectedRequestId, 'BUDGET');
        ctx.setRequests(prev => prev.map(req => (
          req.id === ctx.selectedRequestId ? { ...req, workflowStep: 'BUDGET' } : req
        )));
      } catch (error) {
        console.error('[work-orders] Failed to update workflow step', error);
      }
    }
    ctx.setTab(nextTab);
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
    </div>
  );
};
