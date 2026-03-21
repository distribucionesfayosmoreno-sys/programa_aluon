import { useMemo } from 'react';
import { useCustomers } from '../../../hooks/useCustomers';
import { MODELS } from '../constants';
import { buildWorkOrderNumber, formatLongDate } from '../utils/workOrderNumbers';
import { buildCutlistFormPayload, buildWorkOrderData } from '../utils/workOrderData';
import { useBudgetWorkflow } from './useBudgetWorkflow';
import { useCutlistWorkflow } from './useCutlistWorkflow';
import { useWorkOrderBaseState } from './useWorkOrderBaseState';
import { useWorkOrderRequests } from './useWorkOrderRequests';
import { useWorkflowProgress } from './useWorkflowProgress';
import { useWorkOrderPrinting } from './useWorkOrderPrinting';
import { buildWorkOrdersResult } from './workOrdersResult';

export type UseWorkOrdersResult = ReturnType<typeof useWorkOrders>;

export const useWorkOrders = ({
  openNewRequest,
  onNewRequestHandled,
}: {
  openNewRequest?: boolean;
  onNewRequestHandled?: () => void;
}) => {
  const { customers } = useCustomers();
  const base = useWorkOrderBaseState();

  const { requests, setRequests, customerId, setCustomerId, modelId, setModelId, modelReference, setModelReference, modelImage, setModelImage, m2, setM2, setGoogleView, notes, setNotes, developmentGenerated, setDevelopmentGenerated, prodCut, setProdCut, prodFab, setProdFab, prodLac, setProdLac, prodLacControl, setProdLacControl, finalized, setFinalized, ready, setReady, selectedRequestId, setSelectedRequestId, setTab, setShowRequestModal } = base;

  const selectedModel = useMemo(() => MODELS.find(m => m.id === modelId) ?? MODELS[0], [modelId]);
  const hasModelRef = Boolean(modelReference.trim()) || Boolean(modelImage);
  const selectedCustomer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);

  const budget = useBudgetWorkflow({
    selectedRequestId,
    customerId,
    selectedModel,
    m2,
    hasModelRef,
    modelReference,
    notes,
    requests,
    selectedCustomer,
  });

  const canGenerateDevelopment = budget.budgetGenerated && budget.accountingApproved && budget.adminApproved;

  const cutlist = useCutlistWorkflow({ budgetNumber: budget.budgetNumber, canGenerateDevelopment, notes });

  const workflow = useWorkflowProgress({
    customerId,
    m2,
    hasModelRef,
    budgetGenerated: budget.budgetGenerated,
    accountingApproved: budget.accountingApproved,
    adminApproved: budget.adminApproved,
    developmentGenerated,
    cutlistGenerated: cutlist.cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
    selectedRequestId,
  });
  const currentWorkflowStep = workflow.resolveWorkflowStep();

  const workOrderNumber = useMemo(() => buildWorkOrderNumber(selectedRequestId), [selectedRequestId]);
  const workOrderDate = useMemo(() => formatLongDate(), []);
  const cutlistSnapshot = useMemo(() => ({
    doorType: cutlist.doorType,
    cutlistDistributor: cutlist.cutlistDistributor,
    cutlistBudgetNumber: cutlist.cutlistBudgetNumber,
    cutlistBudgetDate: cutlist.cutlistBudgetDate,
    cutlistColor: cutlist.cutlistColor,
    installerName: cutlist.installerName,
    doorModelLabel: cutlist.doorModelLabel,
    doorTypeLabel: cutlist.doorTypeLabel,
    widthMm: cutlist.widthMm,
    heightMm: cutlist.heightMm,
    heightLeftMm: cutlist.heightLeftMm,
    heightRightMm: cutlist.heightRightMm,
    widthLeftMm: cutlist.widthLeftMm,
    widthRightMm: cutlist.widthRightMm,
    groundClearanceMm: cutlist.groundClearanceMm,
    largueroMm: cutlist.largueroMm,
    topFrame: cutlist.topFrame,
    hingesSide: cutlist.hingesSide,
    porterAutomatic: cutlist.porterAutomatic,
    automationIncluded: cutlist.automationIncluded,
    automationReinforcement: cutlist.automationReinforcement,
    openingSide: cutlist.openingSide,
    railType: cutlist.railType,
    mountingType: cutlist.mountingType,
    tail: cutlist.tail,
    cutlistResult: cutlist.cutlistResult,
  }), [
    cutlist.doorType,
    cutlist.cutlistDistributor,
    cutlist.cutlistBudgetNumber,
    cutlist.cutlistBudgetDate,
    cutlist.cutlistColor,
    cutlist.installerName,
    cutlist.doorModelLabel,
    cutlist.doorTypeLabel,
    cutlist.widthMm,
    cutlist.heightMm,
    cutlist.heightLeftMm,
    cutlist.heightRightMm,
    cutlist.widthLeftMm,
    cutlist.widthRightMm,
    cutlist.groundClearanceMm,
    cutlist.largueroMm,
    cutlist.topFrame,
    cutlist.hingesSide,
    cutlist.porterAutomatic,
    cutlist.automationIncluded,
    cutlist.automationReinforcement,
    cutlist.openingSide,
    cutlist.railType,
    cutlist.mountingType,
    cutlist.tail,
    cutlist.cutlistResult,
  ]);

  const workOrderData = useMemo(
    () => buildWorkOrderData({
      customer: selectedCustomer,
      model: selectedModel,
      modelReference,
      notes,
      workOrderNumber,
      workOrderDate,
      cutlist: cutlistSnapshot,
    }),
    [
      selectedCustomer,
      selectedModel,
      modelReference,
      notes,
      workOrderNumber,
      workOrderDate,
      cutlistSnapshot,
    ],
  );

  const cutlistFormPayload = useMemo(
    () => buildCutlistFormPayload({ cutlist: cutlistSnapshot, notes }),
    [cutlistSnapshot, notes],
  );

  const printing = useWorkOrderPrinting({
    budgetData: budget.budgetData,
    workOrderData,
    accountingApproved: budget.accountingApproved,
    adminApproved: budget.adminApproved,
    canGenerateCutlist: cutlist.canGenerateCutlist,
    cutlistGenerated: cutlist.cutlistGenerated,
    cutlistResult: cutlist.cutlistResult,
    cutlistForm: cutlistFormPayload,
  });

  const resetDownstream = ({ keepBudget }: { keepBudget?: boolean } = {}) => {
    budget.setBudgetGenerated(false);
    budget.setAccountingApproved(false);
    budget.setAdminApproved(false);
    setDevelopmentGenerated(false);
    cutlist.setCutlistGenerated(false);
    cutlist.setCutlistResult(null);
    cutlist.setCutlistError('');
    cutlist.setCutlistLoading(false);
    setProdCut(false);
    setProdFab(false);
    setProdLac(false);
    setProdLacControl(false);
    setFinalized(false);
    setReady('');
    if (selectedRequestId && !keepBudget) {
      budget.updateBudgetStatus(selectedRequestId, {
        budgetGenerated: false,
        accountingApproved: false,
        adminApproved: false,
        approvedAt: undefined,
      });
    }
  };

  const { applyRequest, createRequest } = useWorkOrderRequests({
    customers, requests, setRequests, selectedRequestId, setSelectedRequestId, setCustomerId, setModelId, setM2, setModelReference, setGoogleView, setNotes, setModelImage, setTab, setShowRequestModal, openNewRequest, onNewRequestHandled, resetDownstream,
    budget: { budgetStatusByRequestId: budget.budgetStatusByRequestId, getBudgetStatus: budget.getBudgetStatus, setBudgetGenerated: budget.setBudgetGenerated, setAccountingApproved: budget.setAccountingApproved, setAdminApproved: budget.setAdminApproved, updateBudgetStatus: budget.updateBudgetStatus },
    currentWorkflowStep,
  });

  return buildWorkOrdersResult({
    customers,
    base,
    budget,
    cutlist,
    workflow,
    selectedModel,
    hasModelRef,
    canGenerateDevelopment,
    workOrderData,
    printing,
    applyRequest,
    createRequest,
    resetDownstream,
  });
};
