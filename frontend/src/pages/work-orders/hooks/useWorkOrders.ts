import { useEffect, useMemo, useState } from 'react';
import { useCustomers } from '../../../hooks/useCustomers';
import { CUTLIST_MODEL_IMAGES, CUTLIST_TYPE_IMAGES, DOOR_MODELS, DOOR_TYPES, MODELS, MOCK_REQUESTS } from '../constants';
import type {
  BudgetData,
  CutlistDoorModel,
  CutlistDoorType,
  HingesSide,
  OpeningSide,
  CutlistMountingType,
  CutlistRailType,
  CutlistRequest,
  CutlistResponse,
  NewRequestData,
  PendingBudget,
  TabKey,
  WorkOrderData,
  WorkOrderRequest,
} from '../models';
import { generateCutlist } from '../services/cutlistApi';
import { approveBudgetValidation, createBudgetValidation, listPendingBudgetValidations } from '../services/budgetValidationApi';

export type UseWorkOrdersResult = ReturnType<typeof useWorkOrders>;

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

export const useWorkOrders = ({
  openNewRequest,
  onNewRequestHandled,
}: {
  openNewRequest?: boolean;
  onNewRequestHandled?: () => void;
}) => {
  const { customers } = useCustomers();
  const [requests, setRequests] = useState<WorkOrderRequest[]>(MOCK_REQUESTS);
  const [customerId, setCustomerId] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [modelReference, setModelReference] = useState('');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [m2, setM2] = useState(0);
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');

  const [budgetGenerated, setBudgetGenerated] = useState(false);
  const [accountingApproved, setAccountingApproved] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [budgetStatusByRequestId, setBudgetStatusByRequestId] = useState<Record<string, BudgetStatus>>({});
  const [approverUserId, setApproverUserId] = useState('');
  const [budgetValidationError, setBudgetValidationError] = useState('');

  const [developmentGenerated, setDevelopmentGenerated] = useState(false);
  const [cutlistGenerated, setCutlistGenerated] = useState(false);

  const [doorType, setDoorType] = useState<CutlistDoorType>('PEATONAL');
  const [doorModel, setDoorModel] = useState<CutlistDoorModel>('PREMIUM');
  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [groundClearanceMm, setGroundClearanceMm] = useState(0);
  const [largueroMm, setLargueroMm] = useState<50 | 80>(50);
  const [topFrame, setTopFrame] = useState(true);
  const [hingesSide, setHingesSide] = useState<HingesSide>('LEFT');
  const [porterAutomatic, setPorterAutomatic] = useState(false);
  const [automationIncluded, setAutomationIncluded] = useState(false);
  const [automationReinforcement, setAutomationReinforcement] = useState(false);
  const [openingSide, setOpeningSide] = useState<OpeningSide>('LEFT');
  const [railType, setRailType] = useState<CutlistRailType>('CARRIL_16');
  const [mountingType, setMountingType] = useState<CutlistMountingType>('A');
  const [tail, setTail] = useState(false);
  const [cutlistResult, setCutlistResult] = useState<CutlistResponse | null>(null);
  const [cutlistError, setCutlistError] = useState('');
  const [cutlistLoading, setCutlistLoading] = useState(false);
  const [cutlistImageIndex, setCutlistImageIndex] = useState(0);
  const [cutlistHoverIndex, setCutlistHoverIndex] = useState<number | null>(null);
  const [cutlistPinnedIndex, setCutlistPinnedIndex] = useState<number | null>(null);
  const [cutlistDistributor, setCutlistDistributor] = useState('');
  const [cutlistBudgetNumber, setCutlistBudgetNumber] = useState('');
  const [cutlistBudgetDate, setCutlistBudgetDate] = useState('');
  const [cutlistColor, setCutlistColor] = useState('');

  const [prodCut, setProdCut] = useState(false);
  const [prodFab, setProdFab] = useState(false);
  const [prodLac, setProdLac] = useState(false);
  const [prodLacControl, setProdLacControl] = useState(false);

  const [finalized, setFinalized] = useState(false);
  const [ready, setReady] = useState<'PICKUP' | 'SHIPPING' | ''>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('INBOX');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);

  const selectedModel = MODELS.find(m => m.id === modelId) ?? MODELS[0];
  const hasModelRef = Boolean(modelReference.trim()) || Boolean(modelImage);
  const canGenerateBudget = Boolean(customerId) && m2 > 0 && hasModelRef;

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

  const updateRequestWorkflowStep = (requestId: string, workflowStep: TabKey) => {
    setRequests(prev => prev.map(req => (req.id === requestId ? { ...req, workflowStep } : req)));
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

  const productionSteps = [prodCut, prodFab, prodLac, prodLacControl];
  const productionPct = Math.round((productionSteps.filter(Boolean).length / productionSteps.length) * 100);

  const overallPct = useMemo(() => {
    const checks = [
      Boolean(customerId) && m2 > 0 && hasModelRef,
      budgetGenerated,
      accountingApproved,
      adminApproved,
      developmentGenerated,
      cutlistGenerated,
      prodCut,
      prodFab,
      prodLac,
      prodLacControl,
      finalized,
      ready !== '',
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [
    customerId,
    m2,
    hasModelRef,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    approverUserId,
    developmentGenerated,
    cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
  ]);

  const resetDownstream = ({ keepBudget }: { keepBudget?: boolean } = {}) => {
    setBudgetGenerated(false);
    setAccountingApproved(false);
    setAdminApproved(false);
    setDevelopmentGenerated(false);
    setCutlistGenerated(false);
    setCutlistResult(null);
    setCutlistError('');
    setCutlistLoading(false);
    setProdCut(false);
    setProdFab(false);
    setProdLac(false);
    setProdLacControl(false);
    setFinalized(false);
    setReady('');
    if (selectedRequestId && !keepBudget) {
      updateBudgetStatus(selectedRequestId, {
        budgetGenerated: false,
        accountingApproved: false,
        adminApproved: false,
        approvedAt: undefined,
      });
    }
  };

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

  const canGenerateDevelopment = budgetGenerated && accountingApproved && adminApproved;

  const needsGroundClearance = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsLarguero = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsTopFrame = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsHingesSide = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA';
  const needsPorterAutomatic = doorType === 'PEATONAL';
  const needsAutomation = doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS' || doorType === 'CORREDERA';
  const needsOpeningSide = doorType === 'ABATIBLE_DOS';
  const needsRail = doorType === 'CORREDERA';
  const needsMounting = doorType === 'CORREDERA';
  const needsTail = doorType === 'CORREDERA';

  const cutlistImages = useMemo(() => {
    const modelImageItem = CUTLIST_MODEL_IMAGES[doorModel];
    const typeImages = CUTLIST_TYPE_IMAGES[doorType] ?? [];
    return [modelImageItem, ...typeImages];
  }, [doorModel, doorType]);

  useEffect(() => {
    setCutlistImageIndex(0);
    setCutlistHoverIndex(null);
    setCutlistPinnedIndex(null);
  }, [doorModel, doorType, cutlistResult]);

  useEffect(() => {
    if (automationIncluded) {
      setAutomationReinforcement(true);
    }
  }, [automationIncluded]);

  useEffect(() => {
    if (!cutlistBudgetNumber.trim()) {
      setCutlistBudgetNumber(budgetNumber);
    }
  }, [budgetNumber, cutlistBudgetNumber]);

  useEffect(() => {
    if (!cutlistBudgetDate.trim()) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setCutlistBudgetDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [cutlistBudgetDate]);

  const activeCutlistIndex = cutlistPinnedIndex ?? cutlistHoverIndex;

  const canGenerateCutlist = canGenerateDevelopment
    && widthMm > 0
    && heightMm > 0
    && cutlistDistributor.trim().length > 0
    && cutlistBudgetNumber.trim().length > 0
    && cutlistBudgetDate.trim().length > 0
    && cutlistColor.trim().length > 0
    && (!needsGroundClearance || groundClearanceMm >= 0)
    && (!needsLarguero || (largueroMm === 50 || largueroMm === 80))
    && (!needsTopFrame || typeof topFrame === 'boolean')
    && (!needsHingesSide || Boolean(hingesSide))
    && (!needsPorterAutomatic || typeof porterAutomatic === 'boolean')
    && (!needsAutomation || typeof automationIncluded === 'boolean')
    && (!needsAutomation || typeof automationReinforcement === 'boolean')
    && (!needsOpeningSide || Boolean(openingSide))
    && (!needsRail || Boolean(railType))
    && (!needsMounting || Boolean(mountingType))
    && (!needsTail || typeof tail === 'boolean');

  const buildCutlistPayload = (): CutlistRequest => ({
    distributor: cutlistDistributor.trim(),
    budgetNumber: cutlistBudgetNumber.trim(),
    budgetDate: cutlistBudgetDate.trim(),
    color: cutlistColor.trim(),
    doorType,
    model: doorModel,
    widthMm,
    heightMm,
    groundClearanceMm: needsGroundClearance ? groundClearanceMm : undefined,
    largueroMm: needsLarguero ? largueroMm : undefined,
    topFrame: needsTopFrame ? topFrame : undefined,
    hingesSide: needsHingesSide ? hingesSide : undefined,
    porterAutomatic: needsPorterAutomatic ? porterAutomatic : undefined,
    automationIncluded: needsAutomation ? automationIncluded : undefined,
    automationReinforcement: needsAutomation ? automationReinforcement : undefined,
    openingSide: needsOpeningSide ? openingSide : undefined,
    railType: needsRail ? railType : undefined,
    mountingType: needsMounting ? mountingType : undefined,
    tail: needsTail ? tail : undefined,
    notes,
  });

  const handleGenerateCutlist = async () => {
    if (!canGenerateCutlist) return;
    setCutlistLoading(true);
    setCutlistError('');
    try {
      const data = await generateCutlist(buildCutlistPayload());
      setCutlistResult(data);
      setCutlistGenerated(true);
    } catch (error) {
      setCutlistGenerated(false);
      setCutlistResult(null);
      setCutlistError(error instanceof Error ? error.message : 'Error inesperado al generar el despiece');
    } finally {
      setCutlistLoading(false);
    }
  };

  const clearCutlist = () => {
    setCutlistGenerated(false);
    setCutlistResult(null);
    setCutlistError('');
  };

  const canStartProduction = canGenerateDevelopment && developmentGenerated && cutlistGenerated;
  const canFinalize = canStartProduction && prodCut && prodFab && prodLac && prodLacControl;

  const resolveWorkflowStep = () => {
    if (finalized && ready !== '') return 'FINAL';
    if (prodCut && prodFab && prodLac && prodLacControl) return 'PROD';
    if (developmentGenerated && cutlistGenerated) return 'DEV';
    if (adminApproved) return 'VALIDATION';
    if (budgetGenerated && accountingApproved) return 'BUDGET';
    if (Boolean(customerId) && m2 > 0 && hasModelRef) return 'REQUEST';
    return 'INBOX';
  };

  const pipelineSteps: Array<{ key: TabKey; label: string; done: boolean }> = [
    { key: 'INBOX', label: 'Solicitudes', done: selectedRequestId !== null },
    { key: 'REQUEST', label: 'Solicitud', done: Boolean(customerId) && m2 > 0 && hasModelRef },
    { key: 'BUDGET', label: 'Presupuesto', done: budgetGenerated && accountingApproved },
    { key: 'VALIDATION', label: 'Validación ptos', done: adminApproved },
    { key: 'DEV', label: 'Desarrollo', done: developmentGenerated && cutlistGenerated },
    { key: 'PROD', label: 'Producción', done: prodCut && prodFab && prodLac && prodLacControl },
    { key: 'FINAL', label: 'Finalización', done: finalized && ready !== '' },
  ];

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
    setCustomerId(resolveCustomerId(req.customerName));
    setModelId(req.modelId);
    setM2(req.m2);
    setModelReference(req.reference.toUpperCase());
    setGoogleView(req.googleView);
    setNotes(req.notes);
    setModelImage(null);
    setTab('REQUEST');
    const status = getBudgetStatus(req.id);
    setBudgetGenerated(status.budgetGenerated);
    setAccountingApproved(status.accountingApproved);
    setAdminApproved(status.adminApproved);
  };

  useEffect(() => {
    if (openNewRequest) {
      setShowRequestModal(true);
      onNewRequestHandled?.();
    }
  }, [openNewRequest, onNewRequestHandled]);

  useEffect(() => {
    if (!selectedRequestId) return;
    updateRequestWorkflowStep(selectedRequestId, resolveWorkflowStep());
  }, [
    selectedRequestId,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    developmentGenerated,
    cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
    customerId,
    m2,
    hasModelRef,
  ]);

  useEffect(() => {
    setRequests(prev => prev.map(req => {
      const status = budgetStatusByRequestId[req.id];
      if (!status) return req;
      const nextStep = status.adminApproved
        ? 'VALIDATION'
        : (status.budgetGenerated && status.accountingApproved ? 'BUDGET' : req.workflowStep);
      return nextStep === req.workflowStep ? req : { ...req, workflowStep: nextStep };
    }));
  }, [budgetStatusByRequestId]);

  const createRequest = (data: NewRequestData) => {
    const lastId = requests
      .map(r => Number(r.id.replace('REQ-', '')))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0] ?? 0;
    const nextId = `REQ-${String(lastId + 1).padStart(3, '0')}`;
    setRequests(prev => ([
      {
        id: nextId,
        customerName: data.customerName,
        modelId: data.modelId,
        m2: data.m2,
        reference: data.reference,
        googleView: data.googleView,
        notes: data.notes,
        workflowStep: 'INBOX',
      },
      ...prev,
    ]));
    setSelectedRequestId(nextId);
    setShowRequestModal(false);
    setTab('INBOX');
    updateBudgetStatus(nextId, emptyBudgetStatus);
  };

  const buildBudgetNumber = (requestId: string | null, date = new Date()) => {
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const ref = (requestId ?? 'GEN').replace('REQ-', '');
    return `P-${yy}${mm}${dd}-${ref}`;
  };

  const budgetNumber = useMemo(() => {
    const status = getBudgetStatus(selectedRequestId);
    return status.budgetNumber ?? buildBudgetNumber(selectedRequestId);
  }, [selectedRequestId, budgetStatusByRequestId]);

  const budgetDate = useMemo(() => {
    const date = new Date();
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', opts);
  }, []);

  const workOrderNumber = useMemo(() => {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const ref = (selectedRequestId ?? 'GEN').replace('REQ-', '');
    return `OT-${yy}${mm}${dd}-${ref}`;
  }, [selectedRequestId]);

  const workOrderDate = useMemo(() => {
    const date = new Date();
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', opts);
  }, []);

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedCustomerName = selectedCustomer?.nombreComercial || selectedCustomer?.razonSocial || '—';
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

  const doorTypeLabel = DOOR_TYPES.find(type => type.id === doorType)?.label ?? '—';
  const doorModelLabel = DOOR_MODELS.find(model => model.id === doorModel)?.label ?? '—';
  const workOrderData: WorkOrderData = {
    workOrderNumber,
    workOrderDate,
    customerName: selectedCustomer?.nombreComercial || selectedCustomer?.razonSocial || '—',
    customerAddress: [selectedCustomer?.direccion, selectedCustomer?.cp, selectedCustomer?.poblacion, selectedCustomer?.provincia]
      .filter(Boolean)
      .join(' · '),
    customerPhone: selectedCustomer?.telefono || '—',
    modelLabel: selectedModel.label,
    modelReference: modelReference,
    distributor: cutlistDistributor,
    budgetNumber: cutlistBudgetNumber,
    budgetDate: cutlistBudgetDate,
    color: cutlistColor,
    doorModelLabel,
    doorTypeLabel,
    widthMm,
    heightMm,
    groundClearanceMm,
    largueroMm,
    topFrame,
    hingesSide,
    porterAutomatic,
    automationIncluded,
    automationReinforcement,
    openingSide,
    railType,
    mountingType,
    tail,
    notes,
    items: cutlistResult?.items ?? [],
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

  const handlePrint = () => {
    if (!accountingApproved || !adminApproved) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Presupuesto ${budgetData.budgetNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .small { font-size: 12px; color: #6b7280; }
    .title { font-weight: 800; letter-spacing: 0.15em; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; }
    th { background: #f9fafb; text-align: left; color: #6b7280; }
    .right { text-align: right; }
    .signature { margin-top: 32px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="row">
    <div>
      <div class="title">ALUON</div>
      <div class="small">ALUMINIO SOLDADO, S.L.</div>
      <div class="small">Telf. 925 55 40 14</div>
      <div class="small">Ctra. 4004 Km 29,200 · 45290 Pantoja (Toledo)</div>
      <div class="small">info@aluon.es</div>
    </div>
    <div>
      <div class="title" style="background:#111827;color:#fff;padding:8px 12px;display:inline-block;">ALUON</div>
      <div class="small">${budgetData.customerName}</div>
      <div class="small">${budgetData.customerAddress}</div>
      <div class="small">Telf. ${budgetData.customerPhone}</div>
      <div class="small">Email ${budgetData.customerEmail || '—'}</div>
    </div>
  </div>
  <div class="row" style="margin-top:16px;">
    <div class="small">${budgetData.budgetDate}</div>
    <div><strong>Presupuesto Nº ${budgetData.budgetNumber}</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Cantidad</th>
        <th>Descripción</th>
        <th class="right">Precio Ud.</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${budgetData.m2.toFixed(2)}</td>
        <td>
          <strong>${budgetData.modelLabel}</strong><br />
          <span class="small">Referencia: ${budgetData.reference || '—'}</span><br />
          <span class="small">m²: ${budgetData.m2.toFixed(2)}</span><br />
          ${budgetData.notes ? `<span class="small">Notas: ${budgetData.notes}</span>` : ''}
        </td>
        <td class="right">${budgetData.pricePerM2.toFixed(2)}</td>
        <td class="right"><strong>${budgetData.total.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>
  <div class="small" style="margin-top:16px;">
    <strong style="color:#111827;">Condiciones generales</strong><br />
    Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.<br />
    Validez del presupuesto: 15 días.<br />
    Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.
  </div>
  <div class="signature">
    <div class="small">Conforme el cliente</div>
    <div class="small">Conforme la empresa</div>
  </div>
</body>
</html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const handleEmail = () => {
    if (!accountingApproved || !adminApproved) return;
    const subject = `Presupuesto ${budgetData.budgetNumber}`;
    const body = `Adjunto presupuesto ${budgetData.budgetNumber}.\n\nCliente: ${budgetData.customerName}\nModelo: ${budgetData.modelLabel}\nTotal: ${budgetData.total.toFixed(2)} €\n`;
    const mail = `mailto:${budgetData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mail;
  };

  const handleWorkOrderPrint = () => {
    if (!cutlistResult || !cutlistGenerated) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    const rows = workOrderData.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.units}x</td>
        <td>${item.cutMeasure}</td>
      </tr>
    `).join('');

    w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Orden de trabajo ${workOrderData.workOrderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .small { font-size: 12px; color: #6b7280; }
    .title { font-weight: 800; letter-spacing: 0.15em; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; }
    th { background: #f9fafb; text-align: left; color: #6b7280; }
    .block { margin-top: 16px; }
  </style>
</head>
<body>
  <div class="row">
    <div>
      <div class="title">ALUON</div>
      <div class="small">ALUMINIO SOLDADO, S.L.</div>
      <div class="small">Orden de trabajo</div>
      <div class="small">${workOrderData.workOrderDate}</div>
      <div class="small"><strong>${workOrderData.workOrderNumber}</strong></div>
    </div>
    <div>
      <div class="title" style="background:#111827;color:#fff;padding:8px 12px;display:inline-block;">ALUON</div>
      <div class="small">${workOrderData.customerName}</div>
      <div class="small">${workOrderData.customerAddress}</div>
      <div class="small">Telf. ${workOrderData.customerPhone}</div>
    </div>
  </div>
  <div class="block small">
    <strong>${workOrderData.modelLabel}</strong><br />
    Referencia: ${workOrderData.modelReference || '—'}<br />
    ${workOrderData.doorModelLabel} · ${workOrderData.doorTypeLabel}<br />
    Medidas: ${workOrderData.widthMm} × ${workOrderData.heightMm} mm
  </div>
  <div class="block small">
    Distribuidor: ${workOrderData.distributor || '—'} ·
    Nº Presupuesto: ${workOrderData.budgetNumber || '—'} ·
    Fecha: ${workOrderData.budgetDate || '—'} ·
    Color: ${workOrderData.color || '—'}
  </div>
  <div class="block small">
    Holgura suelo: ${workOrderData.groundClearanceMm ?? '—'} mm ·
    Larguero: ${workOrderData.largueroMm ?? '—'} mm ·
    Marco superior: ${workOrderData.topFrame ? 'Sí' : 'No'} ·
    Bisagras: ${workOrderData.hingesSide === 'LEFT' ? 'Izquierda' : workOrderData.hingesSide === 'RIGHT' ? 'Derecha' : '—'} ·
    Portero automático: ${workOrderData.porterAutomatic ? 'Sí' : 'No'} ·
    Automatización: ${workOrderData.automationIncluded ? 'Sí' : 'No'} ·
    Refuerzo automatización: ${workOrderData.automationReinforcement ? 'Sí' : 'No'}<br />
    Primera hoja: ${workOrderData.openingSide === 'LEFT' ? 'Izquierda' : workOrderData.openingSide === 'RIGHT' ? 'Derecha' : '—'} ·
    Carril: ${workOrderData.railType ?? '—'} ·
    Montaje: ${workOrderData.mountingType ?? '—'} ·
    Cola: ${workOrderData.tail ? 'Sí' : 'No'}
  </div>
  ${workOrderData.notes ? `<div class="block small">Notas: ${workOrderData.notes}</div>` : ''}
  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Unidades</th>
        <th>Medida corte</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return {
    customers,
    requests,
    customerId,
    modelId,
    modelReference,
    modelImage,
    m2,
    googleView,
    notes,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    approverUserId,
    developmentGenerated,
    cutlistGenerated,
    doorType,
    doorModel,
    widthMm,
    heightMm,
    groundClearanceMm,
    largueroMm,
    topFrame,
    hingesSide,
    porterAutomatic,
    automationIncluded,
    automationReinforcement,
    openingSide,
    railType,
    mountingType,
    tail,
    cutlistResult,
    cutlistError,
    cutlistLoading,
    cutlistImageIndex,
    cutlistHoverIndex,
    cutlistPinnedIndex,
    cutlistDistributor,
    cutlistBudgetNumber,
    cutlistBudgetDate,
    cutlistColor,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
    selectedRequestId,
    tab,
    showBudgetModal,
    showRequestModal,
    showWorkOrderModal,
    selectedModel,
    hasModelRef,
    canGenerateBudget,
    budget,
    productionPct,
    overallPct,
    canGenerateDevelopment,
    needsGroundClearance,
    needsLarguero,
    needsTopFrame,
    needsAutomation,
    needsHingesSide,
    needsPorterAutomatic,
    needsOpeningSide,
    needsRail,
    needsMounting,
    needsTail,
    cutlistImages,
    activeCutlistIndex,
    canGenerateCutlist,
    canStartProduction,
    canFinalize,
    pipelineSteps,
    budgetData,
    pendingBudgets,
    budgetValidationError,
    workOrderData,
    setRequests,
    setCustomerId,
    setModelId,
    setModelReference,
    setModelImage,
    setM2,
    setGoogleView,
    setNotes,
    setBudgetGenerated,
    setDevelopmentGenerated,
    setCutlistGenerated,
    setDoorType,
    setDoorModel,
    setWidthMm,
    setHeightMm,
    setGroundClearanceMm,
    setLargueroMm,
    setTopFrame,
    setHingesSide,
    setPorterAutomatic,
    setAutomationIncluded,
    setAutomationReinforcement,
    setOpeningSide,
    setRailType,
    setMountingType,
    setTail,
    setCutlistResult,
    setCutlistError,
    setCutlistLoading,
    setCutlistImageIndex,
    setCutlistHoverIndex,
    setCutlistPinnedIndex,
    setCutlistDistributor,
    setCutlistBudgetNumber,
    setCutlistBudgetDate,
    setCutlistColor,
    setProdCut,
    setProdFab,
    setProdLac,
    setProdLacControl,
    setFinalized,
    setReady,
    setSelectedRequestId,
    setTab,
    setShowBudgetModal,
    setShowRequestModal,
    setShowWorkOrderModal,
    resetDownstream,
    handleGenerateBudget,
    handleToggleAccounting,
    handleApproverUserIdChange,
    handleApproveBudget,
    handleGenerateCutlist,
    clearCutlist,
    applyRequest,
    createRequest,
    handlePrint,
    handleEmail,
    handleWorkOrderPrint,
  };
};
