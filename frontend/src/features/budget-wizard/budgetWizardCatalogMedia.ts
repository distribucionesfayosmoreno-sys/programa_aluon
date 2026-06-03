import type { CatalogFamily, CatalogFamilyChild, ProductCategory } from './BudgetWizard.types';
import { modelImageByDoorModel, variantImageByDoorType } from './budgetWizardImages';

const isRenderableImageValue = (value: string | null | undefined): value is string => {
  if (!value) {
    return false;
  }
  const trimmed = value.trim();
  return (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  );
};

export const resolveFamilyCardImage = (family: CatalogFamily): string => {
  if (isRenderableImageValue(family.imageUrl)) {
    return family.imageUrl;
  }
  return modelImageByDoorModel(family.technicalModel);
};

export const resolveChildCardImage = (child: CatalogFamilyChild): string => {
  if (isRenderableImageValue(child.imageUrl)) {
    return child.imageUrl;
  }
  return variantImageByDoorType(child.doorType);
};

export const formatProductCategoryLabel = (category: ProductCategory): string => {
  switch (category) {
    case 'PUERTA_PASO':
      return 'Puerta paso';
    case 'PUERTA_GARAJE':
      return 'Puerta garaje';
    case 'VALLA':
      return 'Valla';
    case 'REJA':
      return 'Reja';
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
};
