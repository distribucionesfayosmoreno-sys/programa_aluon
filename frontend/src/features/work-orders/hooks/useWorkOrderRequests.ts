import { useCallback, useEffect } from 'react';
import type { Customer } from '../../../hooks/useCustomers';
import type { NewRequestData, TabKey, WorkOrderRequest } from '../models';
import { assignWorkOrderCustomer, createWorkOrderRequest, deleteWorkOrderRequest, updateWorkOrderWorkflowStep } from '../services/requestsApi';
import type { CatalogModelOption } from '../utils/catalogModels';
import { resolveCatalogModelOption } from '../utils/catalogModels';

const STEP_ORDER: TabKey[] = ['INBOX', 'REQUEST', 'BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'];

const stepIndex = (step: TabKey): number => STEP_ORDER.indexOf(step);

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
  catalogModelOptions: CatalogModelOption[];
};

export const useWorkOrderRequests = ({
  customers,
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
  catalogModelOptions,
}: UseWorkOrderRequestsParams) => {
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
    if (!req.customerId && resolvedCustomerId) {
      const persistId = req.orderId || req.id;
      assignWorkOrderCustomer(persistId, resolvedCustomerId).catch(error => {
        console.error('[work-orders] Failed to persist customer assignment', error);
      });
      setRequests(prev => prev.map(item => (
        item.id === req.id ? { ...item, customerId: resolvedCustomerId } : item
      )));
    }
    setModelId(req.modelId);
    setM2(req.m2);
    setModelReference(req.reference.toUpperCase());
    setGoogleView(req.googleView);
    setNotes(req.notes);
    setModelImage(null);
    const nextTab: TabKey = req.workflowStep === 'INBOX' ? 'REQUEST' : req.workflowStep;
    setTab(nextTab);
    if (req.workflowStep === 'INBOX') {
      const persistId = req.orderId || req.id;
      console.info('[work-orders] Auto-advance INBOX -> REQUEST', { requestId: persistId });
      setRequests(prev => prev.map(item => (
        item.id === req.id ? { ...item, workflowStep: 'REQUEST' } : item
      )));
      updateWorkOrderWorkflowStep(persistId, 'REQUEST').catch(error => {
        console.error('[work-orders] Failed to persist workflow step on load', error);
      });
    }
    const status = budget.getBudgetStatus(req.id);
    budget.setBudgetGenerated(status.budgetGenerated);
    budget.setAccountingApproved(status.accountingApproved);
    budget.setAdminApproved(status.adminApproved);
  };

  const createRequest = async (data: NewRequestData) => {
    const requestDate = new Date().toISOString().slice(0, 10);
    const catalogModel = resolveCatalogModelOption(data.modelId, catalogModelOptions) ?? catalogModelOptions[0];
    if (!catalogModel) {
      throw new Error('No hay modelos de catálogo disponibles.');
    }
    const created = await createWorkOrderRequest({
      customerId: data.customerId,
      customerName: data.customerName,
      modeloPuerta: catalogModel.label,
      anchoMm: data.widthMm,
      altoMm: data.heightMm,
      reference: data.reference,
      notes: data.notes,
      color: data.color,
      installerName: data.installerName,
    });

    const uiRequestId = created.codigoOrden;
    const orderId = created.id;
    const m2 = Math.round(((data.widthMm * data.heightMm) / 1_000_000) * 10) / 10;

    setRequests(prev => ([
      {
        id: uiRequestId,
        orderId,
        customerId: data.customerId || undefined,
        customerName: data.customerName,
        modelId: data.modelId,
        modelLabel: catalogModel.label,
        m2,
        widthMm: data.widthMm,
        heightMm: data.heightMm,
        color: data.color || undefined,
        installerName: data.installerName || undefined,
        reference: data.reference,
        googleView: data.googleView,
        notes: data.notes,
        requestDate,
        workflowStep: 'INBOX',
      },
      ...prev,
    ]));
    setSelectedRequestId(uiRequestId);
    setShowRequestModal(false);
    setTab('INBOX');
    budget.updateBudgetStatus(uiRequestId, {
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
    setRequests(prev => prev.map(req => {
      const status = budget.budgetStatusByRequestId[req.id];
      if (!status) return req;
      // Derive the budget-driven target step
      const targetStep: TabKey = status.adminApproved
        ? 'VALIDATION'
        : (status.budgetGenerated && status.accountingApproved ? 'BUDGET' : req.workflowStep);
      // Only advance — never downgrade (e.g. DEV/PROD/FINAL must not revert to VALIDATION)
      const nextStep: TabKey = stepIndex(targetStep) > stepIndex(req.workflowStep)
        ? targetStep
        : req.workflowStep;
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
