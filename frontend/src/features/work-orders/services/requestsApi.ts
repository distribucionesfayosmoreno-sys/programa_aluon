import type { WorkOrderRequest } from '../models';

type OrderStatusApi = {
  id: string;
  customerId?: string | null;
  codigoOrden: string;
  estado: string;
  workflowStep: string;
  workflowStage?: string;
  assignedUserId?: number | null;
  assignedUserName?: string | null;
  customerName: string;
  modeloPuerta?: string | null;
  anchoMm?: number | null;
  altoMm?: number | null;
  notes?: string | null;
  color?: string | null;
  installerName?: string | null;
  requestDate?: string | null;
  m2?: number | null;
};

const resolveModelId = (modeloPuerta?: string | null) => {
  const text = (modeloPuerta ?? '').toLowerCase();
  if (text.includes('classic')) return 'CLASSIC';
  if (text.includes('bisel')) return 'PRO';
  if (text.includes('inox')) return 'LUX';
  if (text.includes('veneciana')) return 'LUX';
  return 'CLASSIC';
};

const resolveRequestDate = (value?: string | null) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
};

export const fetchWorkOrderRequests = async (): Promise<WorkOrderRequest[]> => {
  const response = await fetch('/api/orders/status');
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo cargar la bandeja.');
  }

  const data = (await response.json()) as OrderStatusApi[];
  const mapped = data.map(item => ({
    id: item.codigoOrden || item.id,
    orderId: item.id,
    customerId: item.customerId ?? undefined,
    customerName: item.customerName,
    modelId: resolveModelId(item.modeloPuerta),
    modelLabel: item.modeloPuerta ?? '—',
    m2: item.m2 ?? 0,
    widthMm: item.anchoMm ?? undefined,
    heightMm: item.altoMm ?? undefined,
    color: item.color ?? undefined,
    installerName: item.installerName ?? undefined,
    reference: item.codigoOrden || item.id,
    googleView: false,
    notes: item.notes ?? '',
    requestDate: resolveRequestDate(item.requestDate),
    workflowStep: (item.workflowStage as WorkOrderRequest['workflowStep'])
      ?? (item.workflowStep as WorkOrderRequest['workflowStep'])
      ?? 'INBOX',
    assignedUserId: item.assignedUserId ?? undefined,
    assignedUserName: item.assignedUserName ?? undefined,
  }));
  console.info('[work-orders] Loaded requests', mapped.length, mapped.map(item => ({
    id: item.id,
    orderId: item.orderId,
    workflowStep: item.workflowStep,
  })));
  return mapped;
};

export const deleteWorkOrderRequest = async (orderId: string): Promise<void> => {
  const response = await fetch(`/api/orders/requests/${orderId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo eliminar la solicitud.');
  }
};

export const updateWorkOrderWorkflowStep = async (
  requestId: string,
  workflowStep: string,
  authorizerUserId?: string,
): Promise<void> => {
  console.info('[work-orders] Persist workflow step', { requestId, workflowStep, authorizerUserId });
  const response = await fetch(`/api/orders/requests/${requestId}/workflow-step`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowStep, authorizerUserId }),
  });
  if (!response.ok) {
    const message = await response.text();
    console.error('[work-orders] Persist failed', { requestId, workflowStep, status: response.status, message });
    throw new Error(message || 'No se pudo actualizar el estado.');
  }
  console.info('[work-orders] Persist ok', { requestId, workflowStep });
};

export const assignWorkOrderUser = async (
  orderId: string,
  userId: number,
): Promise<void> => {
  const response = await fetch(`/api/orders/${orderId}/assigned-user`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo asignar el usuario.');
  }
};
