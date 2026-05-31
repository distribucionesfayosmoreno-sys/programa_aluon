import type { DoorModel, DoorType, HingesSide, MountingType, OpeningSide, RailType } from './models';

export type FormState = {
  customerId: string;
  budgetDate: string;
  model: '' | DoorModel;
  doorType: '' | DoorType;
  color: string;
  installerName: string;
  notes: string;
  widthMm: string;
  heightMm: string;
  hasUnevenness: boolean;
  heightLeftMm: string;
  heightRightMm: string;
  groundClearanceMm: string;
  largueroMm: '' | '50' | '80';
  topFrame: '' | 'true' | 'false';
  hingesSide: '' | HingesSide;
  porterAutomatic: '' | 'true' | 'false';
  automationIncluded: '' | 'true' | 'false';
  automationReinforcement: '' | 'true' | 'false';
  openingSide: '' | OpeningSide;
  railType: '' | RailType;
  mountingType: '' | MountingType;
  tail: '' | 'true' | 'false';
};

export type OverlaySpec = {
  text: string;
  x: number; // percent
  y: number; // percent
  size?: number;
  align?: 'left' | 'center' | 'right';
};

export type CheckSpec = {
  checked: boolean | null;
  x: number;
  y: number;
};

export type FormOverlays = {
  overlays: OverlaySpec[];
  checks: CheckSpec[];
};

export type UpdateField = <K extends keyof FormState>(key: K, value: FormState[K]) => void;
