import type { CatalogFamilyResponse } from '../services/catalogModelsApi';

export type CatalogModelOption = {
  id: string;
  technicalModel: string;
  label: string;
  description: string | null;
  imageUrl: string | null;
  pricePerM2: number;
};

const DEFAULT_MODEL_OPTIONS: CatalogModelOption[] = [
  {
    id: 'CLASSIC',
    technicalModel: 'CLASSIC',
    label: 'ALUON Classic',
    description: null,
    imageUrl: null,
    pricePerM2: 175,
  },
  {
    id: 'PREMIUM',
    technicalModel: 'PREMIUM',
    label: 'ALUON Premium',
    description: null,
    imageUrl: null,
    pricePerM2: 205,
  },
  {
    id: 'INOX',
    technicalModel: 'INOX',
    label: 'ALUON Inox',
    description: null,
    imageUrl: null,
    pricePerM2: 250,
  },
  {
    id: 'VENECIANA',
    technicalModel: 'VENECIANA',
    label: 'ALUON Veneciana',
    description: null,
    imageUrl: null,
    pricePerM2: 120,
  },
];

const LEGACY_MODEL_OPTIONS: CatalogModelOption[] = [
  {
    id: 'PRO',
    technicalModel: 'PRO',
    label: 'ALUON Pro',
    description: null,
    imageUrl: null,
    pricePerM2: 190,
  },
  {
    id: 'LUX',
    technicalModel: 'LUX',
    label: 'ALUON Lux',
    description: null,
    imageUrl: null,
    pricePerM2: 260,
  },
];

const normalize = (value: string): string => value.trim().toUpperCase();

export const buildCatalogModelOptions = (families: CatalogFamilyResponse[]): CatalogModelOption[] => {
  const mapped = families.map<CatalogModelOption>(family => ({
    id: family.technicalModel,
    technicalModel: family.technicalModel,
    label: family.name,
    description: family.description,
    imageUrl: family.imageUrl,
    pricePerM2: resolveModelPrice(family.technicalModel),
  }));

  if (mapped.length > 0) {
    return mapped;
  }

  return DEFAULT_MODEL_OPTIONS;
};

export const resolveModelPrice = (technicalModel: string): number => {
  switch (normalize(technicalModel)) {
    case 'CLASSIC':
      return 175;
    case 'PREMIUM':
      return 205;
    case 'INOX':
      return 250;
    case 'VENECIANA':
      return 120;
    case 'PRO':
      return 190;
    case 'LUX':
      return 260;
    default:
      return 0;
  }
};

export const resolveCatalogModelOption = (
  modelId: string,
  options: CatalogModelOption[],
): CatalogModelOption | null => {
  const normalizedModelId = normalize(modelId);
  const match = options.find(option => normalize(option.id) === normalizedModelId || normalize(option.technicalModel) === normalizedModelId);
  if (match) {
    return match;
  }
  return LEGACY_MODEL_OPTIONS.find(option => normalize(option.id) === normalizedModelId) ?? null;
};

export const getDefaultCatalogModelId = (options: CatalogModelOption[]): string => (
  options[0]?.technicalModel ?? DEFAULT_MODEL_OPTIONS[0].technicalModel
);
