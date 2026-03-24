import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { WorkOrdersTabs } from './components/WorkOrdersTabs';
import { WorkOrdersBody } from './components/WorkOrdersBody';
import { useWorkOrdersViewModel } from './hooks/useWorkOrdersViewModel';
import { LegacyCutlistSection } from './sections/LegacyCutlistSection';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
  const { dev, onOpenNewRequest } = useWorkOrdersViewModel(ctx);
  const handleTabChange = (nextTab: UseWorkOrdersResult['tab']) => {
    if (ctx.tab === 'INBOX' && nextTab !== 'INBOX' && ctx.selectedRequestId) {
      const selectedRequest = ctx.requests.find(req => req.id === ctx.selectedRequestId);
      if (selectedRequest) {
        ctx.applyRequest(selectedRequest);
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
      <LegacyCutlistSection />
    </div>
  );
};
