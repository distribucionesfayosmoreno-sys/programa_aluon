import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { WorkOrdersHeader } from './components/WorkOrdersHeader';
import { WorkOrdersTabs } from './components/WorkOrdersTabs';
import { WorkOrdersBody } from './components/WorkOrdersBody';
import { useWorkOrdersViewModel } from './hooks/useWorkOrdersViewModel';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
  const { dev, onOpenNewRequest, onResetDownstream } = useWorkOrdersViewModel(ctx);

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <WorkOrdersHeader
        overallPct={ctx.overallPct}
        onOpenNewRequest={onOpenNewRequest}
        onResetDownstream={onResetDownstream}
      />
      <WorkOrdersTabs
        steps={ctx.pipelineSteps}
        activeTab={ctx.tab}
        onTabChange={ctx.setTab}
      />
      <WorkOrdersBody ctx={ctx} dev={dev} />
    </div>
  );
};
