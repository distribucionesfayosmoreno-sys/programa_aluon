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
} from '../models';
import { generateCutlist } from '../services/cutlistApi';
import { formatIsoDate } from '../utils/workOrderNumbers';

type CutlistWorkflowParams = {
  budgetNumber: string;
  canGenerateDevelopment: boolean;
  notes: string;
};

export const useCutlistWorkflow = ({ budgetNumber, canGenerateDevelopment, notes }: CutlistWorkflowParams) => {
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
