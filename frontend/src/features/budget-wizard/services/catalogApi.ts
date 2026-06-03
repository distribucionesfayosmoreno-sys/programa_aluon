import type { CatalogFamily, CatalogFamilyChild } from '../BudgetWizard.types';

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const getCatalogFamilies = async (): Promise<CatalogFamily[]> => {
  const response = await fetch('/api/catalog/families');
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogFamily[];
};

export const getCatalogChildrenByFamily = async (familyId: string): Promise<CatalogFamilyChild[]> => {
  const response = await fetch(`/api/catalog/children?familyId=${encodeURIComponent(familyId)}`);
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogFamilyChild[];
};
