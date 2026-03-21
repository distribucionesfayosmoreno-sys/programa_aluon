import type { Customer } from '../../hooks/useCustomers';

export type TabKey = 'INBOX' | 'REQUEST' | 'BUDGET' | 'DEV' | 'PROD' | 'FINAL';

export type BudgetData = {
  budgetNumber: string;
  budgetDate: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  modelLabel: string;
  m2: number;
  pricePerM2: number;
  total: number;
  notes: string;
  reference: string;
};

export type NewRequestData = {
  customerName: string;
  modelId: string;
  m2: number;
  reference: string;
  googleView: boolean;
  notes: string;
};

export type CutlistDoorType = 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';
export type CutlistDoorModel = 'PREMIUM' | 'CLASSIC' | 'INOX' | 'VENECIANA';
export type CutlistRailType = 'CARRIL_16' | 'CARRIL_20';
export type CutlistMountingType = 'A' | 'B';

export type CutlistImage = {
  src: string;
  alt: string;
  label: string;
};

export type CutlistRequest = {
  doorType: CutlistDoorType;
  model: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  groundClearanceMm?: number;
  largueroMm?: number;
  topFrame?: boolean;
  automationReinforcement?: boolean;
  railType?: CutlistRailType;
  mountingType?: CutlistMountingType;
  tail?: boolean;
  notes?: string;
};

export type CutlistItem = {
  description: string;
  units: number;
  cutMeasure: string;
};

export type CutlistResponse = {
  id: string;
  doorType: CutlistDoorType;
  model: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  items: CutlistItem[];
};

export type WorkOrderData = {
  workOrderNumber: string;
  workOrderDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  modelLabel: string;
  modelReference: string;
  doorModelLabel: string;
  doorTypeLabel: string;
  widthMm: number;
  heightMm: number;
  groundClearanceMm?: number;
  largueroMm?: number;
  topFrame?: boolean;
  automationReinforcement?: boolean;
  railType?: CutlistRailType;
  mountingType?: CutlistMountingType;
  tail?: boolean;
  notes?: string;
  items: CutlistItem[];
};

export type WorkOrderRequest = {
  id: string;
  customerName: string;
  modelId: string;
  m2: number;
  reference: string;
  googleView: boolean;
  notes: string;
};

export type CustomerOption = Customer;
