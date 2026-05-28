import type { DoorModel, DoorType } from '../customer-onboarding/models';

export type ProductCategory = 'PUERTA_PASO' | 'PUERTA_GARAJE' | 'VALLA' | 'REJA';

export type CatalogModel = {
  id: string;
  modelo: DoorModel;
  imagenModelo: string | null;
};

export type CatalogDoorProduct = {
  id: string;
  modeloId: string;
  producto: ProductCategory;
  imagenModelo: string | null;
};

export type CatalogVariant = {
  id: string;
  puertaId: string;
  variante: DoorType;
  imagenVariante: string | null;
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
