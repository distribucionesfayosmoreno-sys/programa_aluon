import type { DoorModel, DoorType } from '../customer-onboarding/models';

export type ProductCategory = 'PUERTA_PASO' | 'PUERTA_GARAJE' | 'VALLA' | 'REJA';

export type CatalogFamily = {
  id: string;
  technicalModel: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export type CatalogFamilyChild = {
  id: string;
  familyId: string;
  productCategory: ProductCategory;
  doorType: DoorType;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export type ColorHex = `#${string}`;

export type Step =
  | 'MODELO'
  | 'PRODUCTO'
  | 'COLOR'
  | 'APERTURA'
  | 'MEDIDAS'
  | 'CLIENTE'
  | 'RESUMEN'
  | 'ACCIONES'
  | 'FINALIZADO';

export type QuoteItemDraft = {
  catalogFamilyId: string;
  catalogChildId: string;
  familyName: string;
  childName: string;
  doorModel: DoorModel;
  doorType: DoorType;
  productCategory: ProductCategory;
  colorCode: ColorHex;
  primerRequired: boolean;
  widthMm: number;
  heightMm: number;
  floorClearanceMm: number;
  larguero: boolean;
  marcoSuperior: boolean;
  bisagras: boolean;
  porteroAutomatico: boolean;
};
