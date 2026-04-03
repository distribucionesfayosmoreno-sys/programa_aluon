import { useCallback, useEffect } from 'react';
import type { Customer } from '../../../hooks/useCustomers';
import type { NewRequestData, TabKey, WorkOrderRequest } from '../models';
import { deleteWorkOrderRequest, updateWorkOrderWorkflowStep } from '../services/requestsApi';

type BudgetControls = {
  budgetStatusByRequestId: Record<string, { adminApproved: boolean; budgetGenerated: boolean; accountingApproved: boolean }>;
  getBudgetStatus: (requestId: string | null) => { budgetGenerated: boolean; accountingApproved: boolean; adminApproved: boolean };
  setBudgetGenerated: (value: boolean) => void;
  setAccountingApproved: (value: boolean) => void;
  setAdminApproved: (value: boolean) => void;
  updateBudgetStatus: (requestId: string, patch: Partial<{
    budgetGenerated: boolean;
    accountingApproved: boolean;
    adminApproved: boolean;
    approvedAt?: string;
  }>) => void;
};

type UseWorkOrderRequestsParams = {
  customers: Customer[];
  requests: WorkOrderRequest[];
  setRequests: (updater: (prev: WorkOrderRequest[]) => WorkOrderRequest[]) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  setCustomerId: (value: string) => void;
  setModelId: (value: string) => void;
  setM2: (value: number) => void;
  setModelReference: (value: string) => void;
  setGoogleView: (value: boolean) => void;
  setNotes: (value: string) => void;
  setModelImage: (value: File | null) => void;
  setTab: (value: TabKey) => void;
  setShowRequestModal: (value: boolean) => void;
  openNewRequest?: boolean;
  onNewRequestHandled?: () => void;
  resetDownstream: (options?: { keepBudget?: boolean }) => void;
  budget: BudgetControls;
  currentWorkflowStep: TabKey;
};

export const useWorkOrderRequests = ({
  customers,
  requests,
  setRequests,
  selectedRequestId,
  setSelectedRequestId,
  setCustomerId,
  setModelId,
  setM2,
  setModelReference,
  setGoogleView,
  setNotes,
  setModelImage,
  setTab,
  setShowRequestModal,
  openNewRequest,
  onNewRequestHandled,
  resetDownstream,
  budget,
  currentWorkflowStep,
}: UseWorkOrderRequestsParams) => {
  const workflowOrder: TabKey[] = ['INBOX', 'REQUEST', 'BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'];

  const isWorkflowAdvance = useCallback((from: TabKey, to: TabKey) => (
    workflowOrder.indexOf(to) > workflowOrder.indexOf(from)
  ), [workflowOrder]);

  const updateRequestWorkflowStep = useCallback((requestId: string, workflowStep: TabKey) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      if (!isWorkflowAdvance(req.workflowStep, workflowStep)) return req;
      return { ...req, workflowStep };
    }));
  }, [isWorkflowAdvance, setRequests]);

  const resolveCustomerId = (name: string) => {
    const match = customers.find(c => {
      const n = (c.nombreComercial || c.razonSocial || '').toLowerCase();
      return n.includes(name.toLowerCase());
    });
    return match?.id ?? '';
  };

  const applyRequest = (req: WorkOrderRequest) => {
    resetDownstream({ keepBudget: true });
    setSelectedRequestId(req.id);
    const resolvedCustomerId = req.customerId || resolveCustomerId(req.customerName);
    setCustomerId(resolvedCustomerId);
    setModelId(req.modelId);
    setM2(req.m2);
    setModelReference(req.reference.toUpperCase());
    setGoogleView(req.googleView);
    setNotes(req.notes);
    setModelImage(null);
    setTab(req.workflowStep);
    const status = budget.getBudgetStatus(req.id);
    budget.setBudgetGenerated(status.budgetGenerated);
    budget.setAccountingApproved(status.accountingApproved);
    budget.setAdminApproved(status.adminApproved);
  };

  const createRequest = (data: NewRequestData) => {
    const lastId = requests
      .map(r => Number(r.id.replace('REQ-', '')))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0] ?? 0;
    const nextId = `REQ-${String(lastId + 1).padStart(3, '0')}`;
    const requestDate = new Date().toISOString().slice(0, 10);
    setRequests(prev => ([
      {
        id: nextId,
        orderId: nextId,
        customerName: data.customerName,
        modelId: data.modelId,
        m2: data.m2,
        widthMm: 0,
        heightMm: 0,
        color: '',
        installerName: '',
        reference: data.reference,
        googleView: data.googleView,
        notes: data.notes,
        requestDate,
        workflowStep: 'INBOX',
      },
      ...prev,
    ]));
    setSelectedRequestId(nextId);
    setShowRequestModal(false);
    setTab('INBOX');
    budget.updateBudgetStatus(nextId, {
      budgetGenerated: false,
      accountingApproved: false,
      adminApproved: false,
    });
  };

  useEffect(() => {
    if (openNewRequest) {
      setShowRequestModal(true);
      onNewRequestHandled?.();
    }
  }, [openNewRequest, onNewRequestHandled, setShowRequestModal]);

  useEffect(() => {
    if (!selectedRequestId) return;
    const selected = requests.find(req => req.id === selectedRequestId);
    if (!selected) return;
    if (!isWorkflowAdvance(selected.workflowStep, currentWorkflowStep)) return;
    updateRequestWorkflowStep(selectedRequestId, currentWorkflowStep);
    const persist = async () => {
      try {
        await updateWorkOrderWorkflowStep(selectedRequestId, currentWorkflowStep);
      } catch (error) {
        console.error('[work-orders] Failed to persist workflow step', error);
      }
    };
    persist();
  }, [selectedRequestId, currentWorkflowStep, updateRequestWorkflowStep, isWorkflowAdvance, requests]);

  useEffect(() => {
    setRequests(prev => prev.map(req => {
      const status = budget.budgetStatusByRequestId[req.id];
      if (!status) return req;
      const nextStep = status.adminApproved
        ? 'VALIDATION'
        : (status.budgetGenerated && status.accountingApproved ? 'BUDGET' : req.workflowStep);
      return nextStep === req.workflowStep ? req : { ...req, workflowStep: nextStep };
    }));
  }, [budget.budgetStatusByRequestId, setRequests]);

  const deleteRequest = useCallback(async (req: WorkOrderRequest) => {
    if (!req.orderId) {
      throw new Error('No se pudo identificar la solicitud.');
    }
    const isUuid = /^[0-9a-fA-F-]{36}$/.test(req.orderId);
    if (isUuid) {
      await deleteWorkOrderRequest(req.orderId);
    }
    setRequests(prev => prev.filter(item => item.id !== req.id));
    if (selectedRequestId === req.id) {
      setSelectedRequestId(null);
      resetDownstream();
    }
  }, [resetDownstream, selectedRequestId, setRequests, setSelectedRequestId]);

  return { applyRequest, createRequest, deleteRequest };
};

export type UseWorkOrderRequestsResult = ReturnType<typeof useWorkOrderRequests>;
