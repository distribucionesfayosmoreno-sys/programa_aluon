import { useEffect, useMemo, useState } from 'react';
import { CUTLIST_MODEL_IMAGES, CUTLIST_TYPE_IMAGES, DOOR_MODELS, DOOR_TYPES } from '../constants';
import type {
  CutlistDoorModel,
  CutlistDoorType,
  CutlistMountingType,
  CutlistRailType,
  CutlistRequest,
  CutlistResponse,
  HingesSide,
  OpeningSide,
  WorkOrderRequest,
} from '../models';
import { generateCutlist } from '../services/cutlistApi';
import { formatIsoDate } from '../utils/workOrderNumbers';

type CutlistWorkflowParams = {
  budgetNumber: string;
  canGenerateDevelopment: boolean;
  notes: string;
  selectedRequest?: WorkOrderRequest | null;
  selectedCustomerName?: string;
};

const resolveDoorModel = (request?: WorkOrderRequest | null): CutlistDoorModel | null => {
  if (!request) return null;
  const source = `${request.modelLabel ?? ''} ${request.modelId ?? ''}`.toLowerCase();
  if (source.includes('premium')) return 'PREMIUM';
  if (source.includes('classic')) return 'CLASSIC';
  if (source.includes('inox')) return 'INOX';
  if (source.includes('veneciana')) return 'VENECIANA';
  if (source.includes('lux')) return 'INOX';
  if (source.includes('pro')) return 'PREMIUM';
  return null;
};

export const useCutlistWorkflow = ({
  budgetNumber,
  canGenerateDevelopment,
  notes,
  selectedRequest,
  selectedCustomerName,
}: CutlistWorkflowParams) => {
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
  const [installerName, setInstallerName] = useState('');
  const [heightLeftMm, setHeightLeftMm] = useState<number | null>(null);
  const [heightRightMm, setHeightRightMm] = useState<number | null>(null);
  const [widthLeftMm, setWidthLeftMm] = useState<number | null>(null);
  const [widthRightMm, setWidthRightMm] = useState<number | null>(null);
  const [cutlistDistributor, setCutlistDistributor] = useState('');
  const [cutlistBudgetNumber, setCutlistBudgetNumber] = useState('');
  const [cutlistBudgetDate, setCutlistBudgetDate] = useState('');
  const [cutlistColor, setCutlistColor] = useState('');

  const needsGroundClearance = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsLarguero = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsTopFrame = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsHingesSide = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA';
  const needsPorterAutomatic = doorType === 'PEATONAL';
  const needsAutomation = doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS' || doorType === 'CORREDERA';
  const needsOpeningSide = doorType === 'ABATIBLE_DOS' || doorType === 'CORREDERA';
  const needsLeftRightHeights = doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsLeftRightWidths = doorType === 'CORREDERA';
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
    if (!needsLeftRightHeights) {
      setHeightLeftMm(null);
      setHeightRightMm(null);
    }
    if (!needsLeftRightWidths) {
      setWidthLeftMm(null);
      setWidthRightMm(null);
    }
  }, [needsLeftRightHeights, needsLeftRightWidths]);

  useEffect(() => {
    if (automationIncluded) {
      setAutomationReinforcement(true);
    } else {
      setAutomationReinforcement(false);
    }
  }, [automationIncluded]);

  useEffect(() => {
    if (!cutlistBudgetNumber.trim()) {
      setCutlistBudgetNumber(budgetNumber);
    }
  }, [budgetNumber, cutlistBudgetNumber]);

  useEffect(() => {
    if (!cutlistBudgetDate.trim()) {
      setCutlistBudgetDate(formatIsoDate());
    }
  }, [cutlistBudgetDate]);

  useEffect(() => {
    if (!selectedRequest) return;
    if (widthMm <= 0 && selectedRequest.widthMm && selectedRequest.widthMm > 0) {
      setWidthMm(selectedRequest.widthMm);
    }
    if (heightMm <= 0 && selectedRequest.heightMm && selectedRequest.heightMm > 0) {
      setHeightMm(selectedRequest.heightMm);
    }
    if (!cutlistDistributor.trim()) {
      const name = selectedCustomerName?.trim() || selectedRequest.customerName?.trim();
      if (name) setCutlistDistributor(name);
    }
    if (!cutlistColor.trim() && selectedRequest.color?.trim()) {
      setCutlistColor(selectedRequest.color.trim());
    }
    if (!installerName.trim() && selectedRequest.installerName?.trim()) {
      setInstallerName(selectedRequest.installerName.trim());
    }
    const mappedModel = resolveDoorModel(selectedRequest);
    if (mappedModel && doorModel === 'PREMIUM') {
      setDoorModel(mappedModel);
    }
  }, [
    selectedRequest,
    selectedCustomerName,
    widthMm,
    heightMm,
    cutlistDistributor,
    cutlistColor,
    installerName,
    doorModel,
  ]);

  const canGenerateCutlist = canGenerateDevelopment
    && Boolean(selectedRequest?.id)
    && widthMm > 0
    && heightMm > 0
    && cutlistDistributor.trim().length > 0
    && cutlistBudgetNumber.trim().length > 0
    && cutlistBudgetDate.trim().length > 0
    && cutlistColor.trim().length > 0
    && (!needsLeftRightHeights || (heightLeftMm !== null && heightLeftMm > 0 && heightRightMm !== null && heightRightMm > 0))
    && (!needsLeftRightWidths || (widthLeftMm !== null && widthLeftMm > 0 && widthRightMm !== null && widthRightMm > 0))
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

  const activeCutlistIndex = cutlistPinnedIndex ?? cutlistHoverIndex;

  const cutlistBlockingReasons = useMemo(() => {
    if (canGenerateCutlist) {
      return [];
    }
    const reasons: string[] = [];
    if (!canGenerateDevelopment) {
      reasons.push('Completa la aprobación del presupuesto antes de generar el despiece.');
    }
    if (widthMm <= 0 || heightMm <= 0) {
      reasons.push('Introduce anchura y altura válidas.');
    }
    if (needsLeftRightHeights && (heightLeftMm === null || heightLeftMm <= 0 || heightRightMm === null || heightRightMm <= 0)) {
      reasons.push('Completa las alturas izquierda y derecha.');
    }
    if (needsLeftRightWidths && (widthLeftMm === null || widthLeftMm <= 0 || widthRightMm === null || widthRightMm <= 0)) {
      reasons.push('Completa las anchuras izquierda y derecha.');
    }
    if (!selectedRequest?.id) {
      reasons.push('Selecciona una orden.');
    }
    if (!cutlistDistributor.trim()) {
      reasons.push('Indica el distribuidor.');
    }
    if (!cutlistBudgetNumber.trim()) {
      reasons.push('Indica el número de presupuesto.');
    }
    if (!cutlistBudgetDate.trim()) {
      reasons.push('Indica la fecha del presupuesto.');
    }
    if (!cutlistColor.trim()) {
      reasons.push('Indica el color.');
    }
    return reasons;
  }, [
    canGenerateCutlist,
    canGenerateDevelopment,
    widthMm,
    heightMm,
    needsLeftRightHeights,
    heightLeftMm,
    heightRightMm,
    needsLeftRightWidths,
    widthLeftMm,
    widthRightMm,
    cutlistDistributor,
    cutlistBudgetNumber,
    cutlistBudgetDate,
    cutlistColor,
  ]);

  const buildCutlistPayload = (): CutlistRequest => ({
    requestId: selectedRequest?.id ?? '',
    distributor: cutlistDistributor.trim(),
    budgetNumber: cutlistBudgetNumber.trim(),
    budgetDate: cutlistBudgetDate.trim(),
    color: cutlistColor.trim(),
    installerName: installerName.trim(),
    doorType,
    model: doorModel,
    widthMm,
    heightMm,
    heightLeftMm,
    heightRightMm,
    widthLeftMm,
    widthRightMm,
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

  const doorTypeLabel = DOOR_TYPES.find(type => type.id === doorType)?.label ?? '—';
  const doorModelLabel = DOOR_MODELS.find(model => model.id === doorModel)?.label ?? '—';

  return {
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
    installerName,
    heightLeftMm,
    heightRightMm,
    widthLeftMm,
    widthRightMm,
    needsGroundClearance,
    needsLarguero,
    needsTopFrame,
    needsAutomation,
    needsHingesSide,
    needsPorterAutomatic,
    needsOpeningSide,
    needsLeftRightHeights,
    needsLeftRightWidths,
    needsRail,
    needsMounting,
    needsTail,
    cutlistImages,
    activeCutlistIndex,
    cutlistBlockingReasons,
    canGenerateCutlist,
    doorTypeLabel,
    doorModelLabel,
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
    setInstallerName,
    setHeightLeftMm,
    setHeightRightMm,
    setWidthLeftMm,
    setWidthRightMm,
    handleGenerateCutlist,
    clearCutlist,
  };
};

export type UseCutlistWorkflowResult = ReturnType<typeof useCutlistWorkflow>;
