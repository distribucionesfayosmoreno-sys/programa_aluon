import React, { useMemo } from 'react';
import { useWorkOrders } from './hooks/useWorkOrders';
import { useProductionStations } from './hooks/useProductionStations';
import { WorkOrdersView } from './WorkOrdersView';

const WorkOrdersPage: React.FC<{ openNewRequest?: boolean; onNewRequestHandled?: () => void }> = ({
  openNewRequest,
  onNewRequestHandled,
}) => {
  /**
   * Two-phase approach:
   * 1. Create ctx first (has canStartProduction from budget/dev flags)
   * 2. Create production hook using canStartProduction + orderId derived from ctx
   * 3. canFinalize is driven by production.allCompleted via the workflow hook
   *
   * On first render allStationsCompleted defaults to false. Once production
   * stations load, the state updates and triggers a re-render with the correct values.
   */
  // Phase 1: create a preliminary ctx to get canStartProduction & selectedRequestId
  const prelimCtx = useWorkOrders({ openNewRequest, onNewRequestHandled });

  const resolvedOrderId = useMemo(() => {
    if (!prelimCtx.selectedRequestId) return null;
    const req = prelimCtx.requests.find(r => r.id === prelimCtx.selectedRequestId);
    return req?.orderId ?? null;
  }, [prelimCtx.selectedRequestId, prelimCtx.requests]);

  // Phase 2: production stations, depends on canStartProduction from ctx
  const production = useProductionStations({
    orderId: resolvedOrderId,
    canStartProduction: prelimCtx.canStartProduction,
  });

  return <WorkOrdersView ctx={prelimCtx} production={production} />;
};

export default WorkOrdersPage;
