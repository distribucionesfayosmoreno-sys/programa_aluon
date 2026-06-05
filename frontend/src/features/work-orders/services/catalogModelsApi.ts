export type CatalogFamilyResponse = {
  id: string;
  technicalModel: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const listCatalogFamilies = async (): Promise<CatalogFamilyResponse[]> => {
  const response = await fetch('/api/catalog/families');
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CatalogFamilyResponse[];
};
