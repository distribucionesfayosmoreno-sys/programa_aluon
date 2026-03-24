import type { BudgetValidationRecord } from '../models';

export type CreateBudgetValidationPayload = {
  budgetNumber: string;
  requestId: string;
  customerName: string;
  modelLabel: string;
  m2: number;
  total: number;
};

export const createBudgetValidation = async (payload: CreateBudgetValidationPayload): Promise<BudgetValidationRecord> => {
  const response = await fetch('/api/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al crear validación de presupuesto');
  }

  return response.json() as Promise<BudgetValidationRecord>;
};

export const listPendingBudgetValidations = async (): Promise<BudgetValidationRecord[]> => {
  const response = await fetch('/api/budgets/pending');

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al cargar presupuestos pendientes');
  }

  return response.json() as Promise<BudgetValidationRecord[]>;
};

export const approveBudgetValidation = async (id: string, userId: string): Promise<BudgetValidationRecord> => {
  const response = await fetch(`/api/budgets/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al aprobar el presupuesto');
  }

  return response.json() as Promise<BudgetValidationRecord>;
};
