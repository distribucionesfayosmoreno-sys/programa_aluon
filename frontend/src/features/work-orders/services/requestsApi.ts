import type { WorkOrderRequest } from '../models';

type OrderStatusApi = {
  id: string;
  customerId?: string | null;
  codigoOrden: string;
  estado: string;
  workflowStep: string;
  customerName: string;
  modeloPuerta?: string | null;
  anchoMm?: number | null;
  altoMm?: number | null;
  notes?: string | null;
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
  return data.map(item => ({
    id: item.codigoOrden || item.id,
    orderId: item.id,
    customerId: item.customerId ?? undefined,
    customerName: item.customerName,
    modelId: resolveModelId(item.modeloPuerta),
    modelLabel: item.modeloPuerta ?? '—',
    m2: item.m2 ?? 0,
    reference: item.codigoOrden || item.id,
    googleView: false,
    notes: item.notes ?? '',
    requestDate: resolveRequestDate(item.requestDate),
    workflowStep: (item.workflowStep as WorkOrderRequest['workflowStep']) ?? 'INBOX',
  }));
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

export const updateWorkOrderWorkflowStep = async (requestId: string, workflowStep: string): Promise<void> => {
  const response = await fetch(`/api/orders/requests/${requestId}/workflow-step`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowStep }),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo actualizar el estado.');
  }
};
