import { useEffect, useMemo, useState } from 'react';
import { useCustomers } from '../../../hooks/useCustomers';
import { buildWorkOrderNumber, formatLongDate } from '../utils/workOrderNumbers';
import { buildCutlistFormPayload, buildWorkOrderData } from '../utils/workOrderData';
import { useBudgetWorkflow } from './useBudgetWorkflow';
import { useCutlistWorkflow } from './useCutlistWorkflow';
import { useWorkOrderBaseState } from './useWorkOrderBaseState';
import { useWorkOrderRequests } from './useWorkOrderRequests';
import { useWorkflowProgress } from './useWorkflowProgress';
import { useWorkOrderPrinting } from './useWorkOrderPrinting';
import { buildWorkOrdersResult } from './workOrdersResult';
import { listCatalogFamilies } from '../services/catalogModelsApi';
import {
  buildCatalogModelOptions,
  getDefaultCatalogModelId,
  resolveCatalogModelOption,
} from '../utils/catalogModels';
import type { CatalogModelOption } from '../utils/catalogModels';

export type UseWorkOrdersResult = ReturnType<typeof useWorkOrders>;

export const useWorkOrders = ({
  openNewRequest,
  onNewRequestHandled,
  allStationsCompleted = false,
  stationCompletedCount = 0,
  stationTotalCount = 7,
}: {
  openNewRequest?: boolean;
  onNewRequestHandled?: () => void;
  allStationsCompleted?: boolean;
  stationCompletedCount?: number;
  stationTotalCount?: number;
}) => {
  const { customers } = useCustomers();
  const base = useWorkOrderBaseState();
  const [catalogModelOptions, setCatalogModelOptions] = useState(() => buildCatalogModelOptions([]));
  const [catalogModelsLoaded, setCatalogModelsLoaded] = useState(false);

  const { requests, setRequests, customerId, setCustomerId, modelId, setModelId, modelReference, setModelReference, modelImage, setModelImage, m2, setM2, googleView, setGoogleView, notes, setNotes, developmentGenerated, setDevelopmentGenerated, setProdCut, setProdFab, setProdLac, setProdLacControl, finalized, setFinalized, ready, setReady, selectedRequestId, setSelectedRequestId, setTab, setShowRequestModal } = base;

  useEffect(() => {
    let active = true;
    const loadCatalogModels = async () => {
      try {
        const families = await listCatalogFamilies();
        if (!active) return;
        setCatalogModelOptions(buildCatalogModelOptions(families));
      } catch (error) {
        console.error('[work-orders] Failed to load catalog families', error);
        if (active) {
          setCatalogModelOptions(buildCatalogModelOptions([]));
        }
      } finally {
        if (active) {
          setCatalogModelsLoaded(true);
        }
      }
    };

    loadCatalogModels();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!catalogModelsLoaded) return;
    if (modelId.trim()) return;
    setModelId(getDefaultCatalogModelId(catalogModelOptions));
  }, [catalogModelOptions, catalogModelsLoaded, modelId, setModelId]);

  const selectedModel = useMemo<CatalogModelOption>(() => (
    resolveCatalogModelOption(modelId, catalogModelOptions)
    ?? catalogModelOptions[0]
    ?? buildCatalogModelOptions([])[0]
  ), [catalogModelOptions, modelId]);
  const hasModelRef = Boolean(modelReference.trim()) || Boolean(modelImage);
  const selectedCustomer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);
  const resolvedCustomerName = useMemo(
    () => selectedCustomer?.nombreComercial || selectedCustomer?.razonSocial || '',
    [selectedCustomer],
  );

  const budget = useBudgetWorkflow({
    selectedRequestId,
    customerId,
    selectedModel,
    catalogModelOptions,
    m2,
    hasModelRef,
    modelReference,
    notes,
    requests,
    selectedCustomer,
  });

  const canGenerateDevelopment = budget.budgetGenerated && budget.accountingApproved && budget.adminApproved;

  const selectedRequest = useMemo(
    () => requests.find(req => req.id === selectedRequestId) ?? null,
    [requests, selectedRequestId],
  );

  const cutlist = useCutlistWorkflow({
    budgetNumber: budget.budgetNumber,
    canGenerateDevelopment,
    notes,
    selectedRequest,
    selectedCustomerName: resolvedCustomerName,
    catalogModelOptions,
    onCutlistGenerated: (requestId: string) => {
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, workflowStep: 'DEV' } : r,
      ));
    },
  });

  const workflow = useWorkflowProgress({
    customerId,
    m2,
    hasModelRef,
    budgetGenerated: budget.budgetGenerated,
    accountingApproved: budget.accountingApproved,
    adminApproved: budget.adminApproved,
    developmentGenerated,
    cutlistGenerated: cutlist.cutlistGenerated,
    allStationsCompleted,
    stationCompletedCount,
    stationTotalCount,
    finalized,
    ready,
    selectedRequestId,
  });

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
    canPrintBudget: budget.budgetGenerated,
    canEmailBudget: budget.adminApproved,
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

  const { applyRequest, createRequest, deleteRequest } = useWorkOrderRequests({
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
    budget: { budgetStatusByRequestId: budget.budgetStatusByRequestId, getBudgetStatus: budget.getBudgetStatus, setBudgetGenerated: budget.setBudgetGenerated, setAccountingApproved: budget.setAccountingApproved, setAdminApproved: budget.setAdminApproved, updateBudgetStatus: budget.updateBudgetStatus },
    catalogModelOptions,
  });

  useEffect(() => {
    if (!selectedRequestId) return;
    if (base.tab !== 'REQUEST') return;
    setRequests(prev => prev.map(req => {
      if (req.id !== selectedRequestId) return req;
      const nextCustomerName = resolvedCustomerName || req.customerName;
      return {
        ...req,
        customerName: nextCustomerName,
        modelId,
        m2,
        reference: modelReference,
        googleView,
        notes,
      };
    }));
  }, [
    selectedRequestId,
    setRequests,
    resolvedCustomerName,
    modelId,
    m2,
    modelReference,
    googleView,
    notes,
    base.tab,
  ]);

  // Restore DEV/PROD/FINAL UI flags when selecting a request already in those stages
  useEffect(() => {
    if (!selectedRequest) return;
    const step = selectedRequest.workflowStep;
    const isDevOrLater = step === 'DEV' || step === 'PROD' || step === 'FINAL';
    if (isDevOrLater) {
      setDevelopmentGenerated(true);
      cutlist.setCutlistGenerated(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRequest?.id, selectedRequest?.workflowStep]);

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
    deleteRequest,
    resetDownstream,
    catalogModelOptions,
  });
};
