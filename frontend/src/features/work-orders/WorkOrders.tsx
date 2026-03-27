import React from 'react';
import WorkOrdersPage from './WorkOrdersPage';

const WorkOrders: React.FC<{ openNewRequest?: boolean; onNewRequestHandled?: () => void }> = (props) => (
  <WorkOrdersPage {...props} />
);

export default WorkOrders;
