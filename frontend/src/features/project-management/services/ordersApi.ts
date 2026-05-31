export type OrderStatusApi = {
  id: string;
  customerId?: string | null;
  codigoOrden: string;
  estado: string;
  workflowStep?: string;
  workflowStage?: string;
  customerName: string;
  requestDate?: string | null;
};

export const fetchOrderStatuses = async (): Promise<OrderStatusApi[]> => {
  const response = await fetch('/api/orders/status');
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudieron cargar las órdenes de trabajo.');
  }
  return (await response.json()) as OrderStatusApi[];
};

