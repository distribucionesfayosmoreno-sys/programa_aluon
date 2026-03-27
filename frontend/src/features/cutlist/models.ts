export type DoorModel = 'PREMIUM' | 'CLASSIC' | 'INOX' | 'VENECIANA';
export type DoorType = 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';

export type HingesSide = 'LEFT' | 'RIGHT';
export type OpeningSide = 'LEFT' | 'RIGHT';
export type RailType = 'CARRIL_16' | 'CARRIL_20';
export type MountingType = 'A' | 'B';

export type CutlistRequest = {
  distributor: string;
  budgetNumber?: string | null;
  budgetDate: string;
  color: string;
  installerName?: string;
  doorType: DoorType;
  model: DoorModel;
  widthMm: number;
  heightMm: number;
  heightLeftMm?: number | null;
  heightRightMm?: number | null;
  widthLeftMm?: number | null;
  widthRightMm?: number | null;
  groundClearanceMm?: number | null;
  largueroMm?: number | null;
  topFrame?: boolean | null;
  hingesSide?: HingesSide | null;
  porterAutomatic?: boolean | null;
  automationIncluded?: boolean | null;
  automationReinforcement?: boolean | null;
  openingSide?: OpeningSide | null;
  railType?: RailType | null;
  mountingType?: MountingType | null;
  tail?: boolean | null;
  notes?: string | null;
};

export type CutlistItem = {
  description: string;
  units: number;
  cutMeasure: string;
};

export type CutlistResponse = CutlistRequest & {
  id: string;
  createdAt: string;
  items: CutlistItem[];
};
