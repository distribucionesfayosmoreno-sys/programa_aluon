import type { CatalogDoorProduct, CatalogModel, CatalogVariant } from '../BudgetWizard.types';

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const getCatalogModels = async (): Promise<CatalogModel[]> => {
  const response = await fetch('/api/catalog/models');
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogModel[];
};

export const getDoorProductsByModel = async (modeloId: string): Promise<CatalogDoorProduct[]> => {
  const response = await fetch(`/api/catalog/door-products?modeloId=${encodeURIComponent(modeloId)}`);
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogDoorProduct[];
};

export const getVariantsByDoorProduct = async (puertaId: string): Promise<CatalogVariant[]> => {
  const response = await fetch(`/api/catalog/variants?puertaId=${encodeURIComponent(puertaId)}`);
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogVariant[];
};

