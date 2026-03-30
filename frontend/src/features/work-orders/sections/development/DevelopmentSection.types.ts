import type {
  CutlistDoorModel,
  CutlistDoorType,
  CutlistMountingType,
  CutlistRailType,
  CutlistResponse,
  HingesSide,
  OpeningSide,
} from '../../models';

export type DevelopmentStatus = {
  developmentGenerated: boolean;
  cutlistGenerated: boolean;
  canGenerateDevelopment: boolean;
  canGenerateCutlist: boolean;
  cutlistLoading: boolean;
  cutlistError: string;
  cutlistBlockingReasons: string[];
};

export type DevelopmentForm = {
  distributor: string;
  budgetNumber: string;
  budgetDate: string;
  color: string;
  installerName: string;
  heightLeftMm: number | null;
  heightRightMm: number | null;
  widthLeftMm: number | null;
  widthRightMm: number | null;
  doorType: CutlistDoorType;
  doorModel: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  groundClearanceMm: number;
  largueroMm: number;
  topFrame: boolean;
  hingesSide: HingesSide;
  porterAutomatic: boolean;
  automationIncluded: boolean;
  automationReinforcement: boolean;
  openingSide: OpeningSide;
  railType: CutlistRailType;
  mountingType: CutlistMountingType;
  tail: boolean;
};

export type DevelopmentNeeds = {
  needsGroundClearance: boolean;
  needsLarguero: boolean;
  needsTopFrame: boolean;
  needsAutomation: boolean;
  needsHingesSide: boolean;
  needsPorterAutomatic: boolean;
  needsOpeningSide: boolean;
  needsLeftRightHeights: boolean;
  needsLeftRightWidths: boolean;
  needsRail: boolean;
  needsMounting: boolean;
  needsTail: boolean;
};

export type DevelopmentCutlist = {
  cutlistResult: CutlistResponse | null;
  cutlistImages: Array<{ src: string; alt: string; label: string }>;
  cutlistImageIndex: number;
  activeCutlistIndex: number | null;
  cutlistPinnedIndex: number | null;
};

export type DevelopmentActions = {
  onGenerateDevelopment: () => void;
  onGenerateCutlist: () => void;
  onPrintForm: () => void;
  onDistributorChange: (value: string) => void;
  onBudgetNumberChange: (value: string) => void;
  onBudgetDateChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onInstallerNameChange: (value: string) => void;
  onHeightLeftChange: (value: number | null) => void;
  onHeightRightChange: (value: number | null) => void;
  onWidthLeftChange: (value: number | null) => void;
  onWidthRightChange: (value: number | null) => void;
  onDoorTypeChange: (value: CutlistDoorType) => void;
  onDoorModelChange: (value: CutlistDoorModel) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onGroundClearanceChange: (value: number) => void;
  onLargueroChange: (value: 50 | 80) => void;
  onTopFrameChange: (value: boolean) => void;
  onHingesSideChange: (value: HingesSide) => void;
  onPorterAutomaticChange: (value: boolean) => void;
  onAutomationIncludedChange: (value: boolean) => void;
  onAutomationChange: (value: boolean) => void;
  onOpeningSideChange: (value: OpeningSide) => void;
  onRailTypeChange: (value: CutlistRailType) => void;
  onMountingTypeChange: (value: CutlistMountingType) => void;
  onTailChange: (value: boolean) => void;
  onCutlistImageChange: (value: number) => void;
  onCutlistHoverChange: (value: number | null) => void;
  onCutlistPinnedChange: (value: number | null) => void;
};

export type DevelopmentSectionProps = {
  status: DevelopmentStatus;
  form: DevelopmentForm;
  needs: DevelopmentNeeds;
  cutlist: DevelopmentCutlist;
  actions: DevelopmentActions;
  highlightDevelopment?: boolean;
  highlightCutlist?: boolean;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
};
