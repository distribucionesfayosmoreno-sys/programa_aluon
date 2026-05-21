import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Customer } from '../../../hooks/useCustomers';
import type { BudgetData, PendingBudget, WorkOrderRequest } from '../models';
import { MODELS } from '../constants';
import { approveBudgetValidation, createBudgetValidation, listPendingBudgetValidations } from '../services/budgetValidationApi';
import { buildBudgetNumber, formatLongDate } from '../utils/workOrderNumbers';

type BudgetStatus = {
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  budgetNumber?: string;
  validationId?: string;
  customerName?: string;
  modelLabel?: string;
  m2?: number;
  total?: number;
  approvedAt?: string;
  createdAt?: string;
};

const emptyBudgetStatus: BudgetStatus = {
  budgetGenerated: false,
  accountingApproved: false,
  adminApproved: false,
};

type BudgetWorkflowParams = {
  selectedRequestId: string | null;
  customerId: string;
  selectedModel: { id: string; label: string; pricePerM2: number };
  m2: number;
  hasModelRef: boolean;
  modelReference: string;
  notes: string;
  requests: WorkOrderRequest[];
  selectedCustomer?: Customer;
};

export const useBudgetWorkflow = ({
  selectedRequestId,
  customerId,
  selectedModel,
  m2,
  hasModelRef,
  modelReference,
  notes,
  requests,
  selectedCustomer,
}: BudgetWorkflowParams) => {
  const [budgetGenerated, setBudgetGenerated] = useState(false);
  const [accountingApproved, setAccountingApproved] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [budgetStatusByRequestId, setBudgetStatusByRequestId] = useState<Record<string, BudgetStatus>>({});
  const [approverUserId, setApproverUserId] = useState('');
  const [budgetValidationError, setBudgetValidationError] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const selectedCustomerName = selectedCustomer?.nombreComercial || selectedCustomer?.razonSocial || '—';

  const getBudgetStatus = useCallback((requestId: string | null) => {
    if (!requestId) return emptyBudgetStatus;
    const baseStatus = budgetStatusByRequestId[requestId] ?? emptyBudgetStatus;
    const req = requests.find(r => r.id === requestId);
    if (!req) return baseStatus;

    const step = req.workflowStep;
    const hasBudget = ['BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'].includes(step);
    const hasAdminApprove = ['VALIDATION', 'DEV', 'PROD', 'FINAL'].includes(step);

    return {
      ...baseStatus,
      budgetGenerated: baseStatus.budgetGenerated || hasBudget,
      accountingApproved: baseStatus.accountingApproved || hasBudget,
      adminApproved: baseStatus.adminApproved || hasAdminApprove,
    };
  }, [budgetStatusByRequestId, requests]);

  const updateBudgetStatus = useCallback((requestId: string, patch: Partial<BudgetStatus>) => {
    setBudgetStatusByRequestId(prev => ({
      ...prev,
      [requestId]: {
        ...emptyBudgetStatus,
        ...prev[requestId],
        ...patch,
      },
    }));
  }, []);

  useEffect(() => {
    if (!selectedRequestId) return;
    const status = getBudgetStatus(selectedRequestId);
    setBudgetGenerated(status.budgetGenerated);
    setAccountingApproved(status.accountingApproved);
    setAdminApproved(status.adminApproved);
  }, [selectedRequestId, getBudgetStatus]);

  useEffect(() => {
    const loadPending = async () => {
      try {
        const records = await listPendingBudgetValidations();
        setBudgetStatusByRequestId(prev => {
          const next = { ...prev };
          records.forEach(record => {
            next[record.requestId] = {
              ...emptyBudgetStatus,
              ...next[record.requestId],
              budgetGenerated: true,
              accountingApproved: true,
              adminApproved: false,
              validationId: record.id,
              budgetNumber: record.budgetNumber,
              customerName: record.customerName,
              modelLabel: record.modelLabel ?? undefined,
              m2: record.m2 ?? undefined,
              total: record.total,
              createdAt: record.createdAt,
            };
          });
          return next;
        });
        setBudgetValidationError('');
      } catch (error) {
        setBudgetValidationError(error instanceof Error ? error.message : 'Error al cargar validaciones pendientes');
      }
    };

    loadPending();
  }, []);

  useEffect(() => {
    if (requests.length === 0) return;
    setBudgetStatusByRequestId(prev => {
      let changed = false;
      const next = { ...prev };
      requests.forEach(req => {
        const step = req.workflowStep;
        const hasBudget = ['BUDGET', 'VALIDATION', 'DEV', 'PROD', 'FINAL'].includes(step);
        const hasAdminApprove = ['VALIDATION', 'DEV', 'PROD', 'FINAL'].includes(step);

        const current = next[req.id] || emptyBudgetStatus;
        const needsBudgetGen = hasBudget && !current.budgetGenerated;
        const needsAcctApprove = hasBudget && !current.accountingApproved;
        const needsAdminApprove = hasAdminApprove && !current.adminApproved;

        if (needsBudgetGen || needsAcctApprove || needsAdminApprove) {
          next[req.id] = {
            ...current,
            budgetGenerated: current.budgetGenerated || hasBudget,
            accountingApproved: current.accountingApproved || hasBudget,
            adminApproved: current.adminApproved || hasAdminApprove,
          };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [requests]);


  const budget = useMemo(() => {
    const base = selectedModel.pricePerM2;
    const total = Math.round(m2 * base * 100) / 100;
    return { base, total };
  }, [m2, selectedModel]);

  const budgetNumber = useMemo(() => {
    const status = getBudgetStatus(selectedRequestId);
    return status.budgetNumber ?? buildBudgetNumber(selectedRequestId);
  }, [selectedRequestId, getBudgetStatus]);

  const budgetDate = useMemo(() => formatLongDate(), []);

  const canGenerateBudget = Boolean(customerId) && m2 > 0 && hasModelRef;

  const handleGenerateBudget = () => {
    if (!canGenerateBudget) return;
    setBudgetGenerated(true);
    setShowBudgetModal(true);
    if (selectedRequestId) {
      updateBudgetStatus(selectedRequestId, {
        budgetGenerated: true,
        budgetNumber: buildBudgetNumber(selectedRequestId),
        createdAt: new Date().toISOString(),
        customerName: selectedCustomerName,
        modelLabel: selectedModel.label,
        m2,
        total: budget.total,
      });
    }
  };

  const pendingBudgets: PendingBudget[] = useMemo(() => {
    const pending: PendingBudget[] = [];
    const handled = new Set<string>();

    requests.forEach(req => {
      const status = getBudgetStatus(req.id);
      if (!status.validationId || !status.budgetGenerated || !status.accountingApproved || status.adminApproved) return;
      const model = MODELS.find(m => m.id === req.modelId) ?? MODELS[0];
      const total = status.total ?? Math.round(req.m2 * model.pricePerM2 * 100) / 100;
      pending.push({
        validationId: status.validationId,
        requestId: req.id,
        budgetNumber: status.budgetNumber ?? buildBudgetNumber(req.id),
        customerName: status.customerName ?? req.customerName,
        modelLabel: status.modelLabel ?? model.label,
        m2: status.m2 ?? req.m2,
        total,
      });
      handled.add(req.id);
    });

    Object.entries(budgetStatusByRequestId).forEach(([requestId, status]) => {
      if (handled.has(requestId)) return;
      if (!status.validationId || !status.budgetGenerated || !status.accountingApproved || status.adminApproved) return;
      if (!status.customerName || !status.modelLabel || status.m2 == null || status.total == null) return;
      pending.push({
        validationId: status.validationId,
        requestId,
        budgetNumber: status.budgetNumber ?? buildBudgetNumber(requestId),
        customerName: status.customerName,
        modelLabel: status.modelLabel,
        m2: status.m2,
        total: status.total,
      });
    });

    return pending;
  }, [requests, budgetStatusByRequestId, getBudgetStatus]);

  const handleToggleAccounting = async () => {
    if (!budgetGenerated) return;
    const nextValue = !accountingApproved;
    setAccountingApproved(nextValue);
    if (selectedRequestId) {
      updateBudgetStatus(selectedRequestId, { accountingApproved: nextValue });
    }
    if (!nextValue || !selectedRequestId) return;

    const status = getBudgetStatus(selectedRequestId);
    if (status.validationId) return;

    try {
      const record = await createBudgetValidation({
        budgetNumber: status.budgetNumber ?? buildBudgetNumber(selectedRequestId),
        requestId: selectedRequestId,
        customerName: selectedCustomerName,
        modelLabel: selectedModel.label,
        m2,
        total: budget.total,
      });
      updateBudgetStatus(selectedRequestId, {
        validationId: record.id,
        budgetNumber: record.budgetNumber,
        customerName: record.customerName,
        modelLabel: record.modelLabel ?? undefined,
        m2: record.m2 ?? undefined,
        total: record.total,
        createdAt: record.createdAt,
      });
      setBudgetValidationError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear validación del presupuesto';
      setBudgetValidationError(message);
      setAccountingApproved(false);
      updateBudgetStatus(selectedRequestId, { accountingApproved: false });
    }
  };

  const handleApproverUserIdChange = (value: string) => {
    setApproverUserId(value);
  };

  const handleApproveBudget = async (validationId: string) => {
    const rawId = approverUserId.trim();
    if (!rawId) return;
    if (!/^\d+$/.test(rawId)) {
      setBudgetValidationError('El ID del usuario debe ser numérico.');
      return;
    }
    try {
      const record = await approveBudgetValidation(validationId, rawId);
      updateBudgetStatus(record.requestId, {
        adminApproved: true,
        approvedAt: record.approvedAt ?? new Date().toISOString(),
      });
      if (selectedRequestId === record.requestId) {
        setAdminApproved(true);
      }
      setBudgetValidationError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al aprobar el presupuesto';
      setBudgetValidationError(message);
    }
  };

  const budgetData: BudgetData = {
    budgetNumber,
    budgetDate,
    customerName: selectedCustomerName,
    customerAddress: [selectedCustomer?.direccion, selectedCustomer?.cp, selectedCustomer?.poblacion, selectedCustomer?.provincia]
      .filter(Boolean)
      .join(' · '),
    customerEmail: selectedCustomer?.email || '',
    customerPhone: selectedCustomer?.telefono || '—',
    modelLabel: selectedModel.label,
    m2,
    pricePerM2: selectedModel.pricePerM2,
    total: budget.total,
    notes,
    reference: modelReference,
  };

  return {
    budgetGenerated,
    accountingApproved,
    adminApproved,
    budgetStatusByRequestId,
    approverUserId,
    budgetValidationError,
    showBudgetModal,
    budget,
    budgetNumber,
    budgetDate,
    budgetData,
    pendingBudgets,
    canGenerateBudget,
    setBudgetGenerated,
    setAccountingApproved,
    setAdminApproved,
    setShowBudgetModal,
    getBudgetStatus,
    updateBudgetStatus,
    handleGenerateBudget,
    handleToggleAccounting,
    handleApproverUserIdChange,
    handleApproveBudget,
    setBudgetValidationError,
  };
};

export type UseBudgetWorkflowResult = ReturnType<typeof useBudgetWorkflow>;
