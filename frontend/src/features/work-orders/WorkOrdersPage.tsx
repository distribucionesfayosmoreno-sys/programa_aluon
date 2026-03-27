import React from 'react';
import { useWorkOrders } from './hooks/useWorkOrders';
import { WorkOrdersView } from './WorkOrdersView';

const WorkOrdersPage: React.FC<{ openNewRequest?: boolean; onNewRequestHandled?: () => void }> = ({
  openNewRequest,
  onNewRequestHandled,
}) => {
  const ctx = useWorkOrders({ openNewRequest, onNewRequestHandled });
  return <WorkOrdersView ctx={ctx} />;
};

export default WorkOrdersPage;
