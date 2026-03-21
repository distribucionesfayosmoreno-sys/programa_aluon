import { useEffect, useMemo, useState } from 'react';
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

  const getBudgetStatus = (requestId: string | null) => (
    requestId ? (budgetStatusByRequestId[requestId] ?? emptyBudgetStatus) : emptyBudgetStatus
  );

  const updateBudgetStatus = (requestId: string, patch: Partial<BudgetStatus>) => {
    setBudgetStatusByRequestId(prev => ({
      ...prev,
      [requestId]: {
        ...emptyBudgetStatus,
        ...prev[requestId],
        ...patch,
      },
    }));
  };

  useEffect(() => {
    if (!selectedRequestId) return;
    const status = getBudgetStatus(selectedRequestId);
    setBudgetGenerated(status.budgetGenerated);
    setAccountingApproved(status.accountingApproved);
    setAdminApproved(status.adminApproved);
  }, [selectedRequestId, budgetStatusByRequestId]);

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

  const budget = useMemo(() => {
    const base = selectedModel.pricePerM2;
    const total = Math.round(m2 * base * 100) / 100;
    return { base, total };
  }, [m2, selectedModel]);

  const budgetNumber = useMemo(() => {
    const status = getBudgetStatus(selectedRequestId);
    return status.budgetNumber ?? buildBudgetNumber(selectedRequestId);
  }, [selectedRequestId, budgetStatusByRequestId]);

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
  }, [requests, budgetStatusByRequestId]);

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
    if (!approverUserId.trim()) return;
    try {
      const record = await approveBudgetValidation(validationId, approverUserId.trim());
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
  };
};

export type UseBudgetWorkflowResult = ReturnType<typeof useBudgetWorkflow>;
