import type {
  ProductCatalogChild,
  ProductCatalogChildForm,
  ProductCatalogFamily,
  ProductCatalogFamilyForm,
} from './AdminManagement.types';

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

const jsonHeaders = { 'Content-Type': 'application/json' };

export const listProductCatalogFamilies = async (): Promise<ProductCatalogFamily[]> => {
  const response = await fetch('/api/admin/catalog/families');
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as ProductCatalogFamily[];
};

export const createProductCatalogFamily = async (payload: ProductCatalogFamilyForm): Promise<ProductCatalogFamily> => {
  const response = await fetch('/api/admin/catalog/families', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as ProductCatalogFamily;
};

export const updateProductCatalogFamily = async (familyId: string, payload: ProductCatalogFamilyForm): Promise<ProductCatalogFamily> => {
  const response = await fetch(`/api/admin/catalog/families/${encodeURIComponent(familyId)}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as ProductCatalogFamily;
};

export const deleteProductCatalogFamily = async (familyId: string): Promise<void> => {
  const response = await fetch(`/api/admin/catalog/families/${encodeURIComponent(familyId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
};

export const createProductCatalogChild = async (payload: ProductCatalogChildForm): Promise<ProductCatalogChild> => {
  const response = await fetch('/api/admin/catalog/children', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as ProductCatalogChild;
};

export const updateProductCatalogChild = async (childId: string, payload: ProductCatalogChildForm): Promise<ProductCatalogChild> => {
  const response = await fetch(`/api/admin/catalog/children/${encodeURIComponent(childId)}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
  return (await response.json()) as ProductCatalogChild;
};

export const deleteProductCatalogChild = async (childId: string): Promise<void> => {
  const response = await fetch(`/api/admin/catalog/children/${encodeURIComponent(childId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await readTextError(response));
  }
};
