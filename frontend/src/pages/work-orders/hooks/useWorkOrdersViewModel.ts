import { useCallback, useMemo } from 'react';
import type { CutlistDoorModel, CutlistDoorType, CutlistMountingType, CutlistRailType, HingesSide, OpeningSide } from '../models';
import type { UseWorkOrdersResult } from './useWorkOrders';
import type { DevelopmentActions, DevelopmentCutlist, DevelopmentForm, DevelopmentNeeds, DevelopmentStatus } from '../sections/development/DevelopmentSection.types';

type DevelopmentViewModel = {
  status: DevelopmentStatus;
  form: DevelopmentForm;
  needs: DevelopmentNeeds;
  cutlist: DevelopmentCutlist;
  actions: DevelopmentActions;
};

type UseWorkOrdersViewModelResult = {
  dev: DevelopmentViewModel;
  onOpenNewRequest: () => void;
  onResetDownstream: () => void;
};

export const useWorkOrdersViewModel = (ctx: UseWorkOrdersResult): UseWorkOrdersViewModelResult => {
  const {
    developmentGenerated,
    cutlistGenerated,
    canGenerateDevelopment,
    canGenerateCutlist,
    cutlistLoading,
    cutlistError,
    cutlistBlockingReasons,
    cutlistDistributor,
    cutlistBudgetNumber,
    cutlistBudgetDate,
    cutlistColor,
    installerName,
    heightLeftMm,
    heightRightMm,
    widthLeftMm,
    widthRightMm,
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
    cutlistResult,
    cutlistImages,
    cutlistImageIndex,
    activeCutlistIndex,
    cutlistPinnedIndex,
    setDevelopmentGenerated,
    setCutlistDistributor,
    setCutlistBudgetNumber,
    setCutlistBudgetDate,
    setCutlistColor,
    setInstallerName,
    setHeightLeftMm,
    setHeightRightMm,
    setWidthLeftMm,
    setWidthRightMm,
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
    setCutlistImageIndex,
    setCutlistHoverIndex,
    setCutlistPinnedIndex,
    handleGenerateCutlist,
    handleCutlistFormPrint,
    clearCutlist,
    setShowRequestModal,
    resetDownstream,
  } = ctx;

  const handleGenerateDevelopment = useCallback(() => {
    setDevelopmentGenerated(true);
  }, [setDevelopmentGenerated]);

  const handleDistributorChange = useCallback((value: string) => {
    setCutlistDistributor(value);
  }, [setCutlistDistributor]);

  const handleBudgetNumberChange = useCallback((value: string) => {
    setCutlistBudgetNumber(value);
  }, [setCutlistBudgetNumber]);

  const handleBudgetDateChange = useCallback((value: string) => {
    setCutlistBudgetDate(value);
  }, [setCutlistBudgetDate]);

  const handleColorChange = useCallback((value: string) => {
    setCutlistColor(value);
  }, [setCutlistColor]);

  const handleInstallerNameChange = useCallback((value: string) => {
    setInstallerName(value);
  }, [setInstallerName]);

  const handleHeightLeftChange = useCallback((value: number | null) => {
    setHeightLeftMm(value);
  }, [setHeightLeftMm]);

  const handleHeightRightChange = useCallback((value: number | null) => {
    setHeightRightMm(value);
  }, [setHeightRightMm]);

  const handleWidthLeftChange = useCallback((value: number | null) => {
    setWidthLeftMm(value);
  }, [setWidthLeftMm]);

  const handleWidthRightChange = useCallback((value: number | null) => {
    setWidthRightMm(value);
  }, [setWidthRightMm]);

  const handleDoorTypeChange = useCallback((value: CutlistDoorType) => {
    setDoorType(value);
    clearCutlist();
  }, [clearCutlist, setDoorType]);

  const handleDoorModelChange = useCallback((value: CutlistDoorModel) => {
    setDoorModel(value);
    clearCutlist();
  }, [clearCutlist, setDoorModel]);

  const handleWidthChange = useCallback((value: number) => {
    setWidthMm(value);
    clearCutlist();
  }, [clearCutlist, setWidthMm]);

  const handleHeightChange = useCallback((value: number) => {
    setHeightMm(value);
    clearCutlist();
  }, [clearCutlist, setHeightMm]);

  const handleGroundClearanceChange = useCallback((value: number) => {
    setGroundClearanceMm(value);
    clearCutlist();
  }, [clearCutlist, setGroundClearanceMm]);

  const handleLargueroChange = useCallback((value: number) => {
    setLargueroMm(value);
    clearCutlist();
  }, [clearCutlist, setLargueroMm]);

  const handleTopFrameChange = useCallback((value: boolean) => {
    setTopFrame(value);
    clearCutlist();
  }, [clearCutlist, setTopFrame]);

  const handleHingesSideChange = useCallback((value: HingesSide) => {
    setHingesSide(value);
    clearCutlist();
  }, [clearCutlist, setHingesSide]);

  const handlePorterAutomaticChange = useCallback((value: boolean) => {
    setPorterAutomatic(value);
    clearCutlist();
  }, [clearCutlist, setPorterAutomatic]);

  const handleAutomationIncludedChange = useCallback((value: boolean) => {
    setAutomationIncluded(value);
    clearCutlist();
  }, [clearCutlist, setAutomationIncluded]);

  const handleAutomationChange = useCallback((value: boolean) => {
    setAutomationReinforcement(value);
    clearCutlist();
  }, [clearCutlist, setAutomationReinforcement]);

  const handleOpeningSideChange = useCallback((value: OpeningSide) => {
    setOpeningSide(value);
    clearCutlist();
  }, [clearCutlist, setOpeningSide]);

  const handleRailTypeChange = useCallback((value: CutlistRailType) => {
    setRailType(value);
    clearCutlist();
  }, [clearCutlist, setRailType]);

  const handleMountingTypeChange = useCallback((value: CutlistMountingType) => {
    setMountingType(value);
    clearCutlist();
  }, [clearCutlist, setMountingType]);

  const handleTailChange = useCallback((value: boolean) => {
    setTail(value);
    clearCutlist();
  }, [clearCutlist, setTail]);

  const handleCutlistImageChange = useCallback((index: number) => {
    setCutlistImageIndex(index);
  }, [setCutlistImageIndex]);

  const handleCutlistHoverChange = useCallback((index: number | null) => {
    setCutlistHoverIndex(index);
  }, [setCutlistHoverIndex]);

  const handleCutlistPinnedChange = useCallback((index: number | null) => {
    setCutlistPinnedIndex(index);
  }, [setCutlistPinnedIndex]);

  const status = useMemo<DevelopmentStatus>(() => ({
    developmentGenerated,
    cutlistGenerated,
    canGenerateDevelopment,
    canGenerateCutlist,
    cutlistLoading,
    cutlistError,
    cutlistBlockingReasons,
  }), [
    developmentGenerated,
    cutlistGenerated,
    canGenerateDevelopment,
    canGenerateCutlist,
    cutlistLoading,
    cutlistError,
    cutlistBlockingReasons,
  ]);

  const form = useMemo<DevelopmentForm>(() => ({
    distributor: cutlistDistributor,
    budgetNumber: cutlistBudgetNumber,
    budgetDate: cutlistBudgetDate,
    color: cutlistColor,
    installerName,
    heightLeftMm,
    heightRightMm,
    widthLeftMm,
    widthRightMm,
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
  }), [
    cutlistDistributor,
    cutlistBudgetNumber,
    cutlistBudgetDate,
    cutlistColor,
    installerName,
    heightLeftMm,
    heightRightMm,
    widthLeftMm,
    widthRightMm,
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
  ]);

  const needs = useMemo<DevelopmentNeeds>(() => ({
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
  }), [
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
  ]);

  const cutlist = useMemo<DevelopmentCutlist>(() => ({
    cutlistResult,
    cutlistImages,
    cutlistImageIndex,
    activeCutlistIndex,
    cutlistPinnedIndex,
  }), [
    cutlistResult,
    cutlistImages,
    cutlistImageIndex,
    activeCutlistIndex,
    cutlistPinnedIndex,
  ]);

  const actions = useMemo<DevelopmentActions>(() => ({
    onGenerateDevelopment: handleGenerateDevelopment,
    onGenerateCutlist: handleGenerateCutlist,
    onPrintForm: handleCutlistFormPrint,
    onDistributorChange: handleDistributorChange,
    onBudgetNumberChange: handleBudgetNumberChange,
    onBudgetDateChange: handleBudgetDateChange,
    onColorChange: handleColorChange,
    onInstallerNameChange: handleInstallerNameChange,
    onHeightLeftChange: handleHeightLeftChange,
    onHeightRightChange: handleHeightRightChange,
    onWidthLeftChange: handleWidthLeftChange,
    onWidthRightChange: handleWidthRightChange,
    onDoorTypeChange: handleDoorTypeChange,
    onDoorModelChange: handleDoorModelChange,
    onWidthChange: handleWidthChange,
    onHeightChange: handleHeightChange,
    onGroundClearanceChange: handleGroundClearanceChange,
    onLargueroChange: handleLargueroChange,
    onTopFrameChange: handleTopFrameChange,
    onHingesSideChange: handleHingesSideChange,
    onPorterAutomaticChange: handlePorterAutomaticChange,
    onAutomationIncludedChange: handleAutomationIncludedChange,
    onAutomationChange: handleAutomationChange,
    onOpeningSideChange: handleOpeningSideChange,
    onRailTypeChange: handleRailTypeChange,
    onMountingTypeChange: handleMountingTypeChange,
    onTailChange: handleTailChange,
    onCutlistImageChange: handleCutlistImageChange,
    onCutlistHoverChange: handleCutlistHoverChange,
    onCutlistPinnedChange: handleCutlistPinnedChange,
  }), [
    handleGenerateDevelopment,
    handleGenerateCutlist,
    handleCutlistFormPrint,
    handleDistributorChange,
    handleBudgetNumberChange,
    handleBudgetDateChange,
    handleColorChange,
    handleInstallerNameChange,
    handleHeightLeftChange,
    handleHeightRightChange,
    handleWidthLeftChange,
    handleWidthRightChange,
    handleDoorTypeChange,
    handleDoorModelChange,
    handleWidthChange,
    handleHeightChange,
    handleGroundClearanceChange,
    handleLargueroChange,
    handleTopFrameChange,
    handleHingesSideChange,
    handlePorterAutomaticChange,
    handleAutomationIncludedChange,
    handleAutomationChange,
    handleOpeningSideChange,
    handleRailTypeChange,
    handleMountingTypeChange,
    handleTailChange,
    handleCutlistImageChange,
    handleCutlistHoverChange,
    handleCutlistPinnedChange,
  ]);

  return {
    dev: { status, form, needs, cutlist, actions },
    onOpenNewRequest: () => setShowRequestModal(true),
    onResetDownstream: () => resetDownstream(),
  };
};
