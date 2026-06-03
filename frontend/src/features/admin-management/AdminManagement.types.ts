import type { DoorType } from '../customer-onboarding/models';
import type { ProductCategory } from '../budget-wizard/BudgetWizard.types';

export type AdminManagementTab = 'USERS' | 'PRODUCT_FAMILIES';

export type ProductCatalogChild = {
  id: string;
  familyId: string;
  productCategory: ProductCategory;
  doorType: DoorType;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
};

export type ProductCatalogFamily = {
  id: string;
  technicalModel: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
  children: ProductCatalogChild[];
};

export type ProductCatalogFamilyForm = {
  technicalModel: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
};

export type ProductCatalogChildForm = {
  familyId: string;
  productCategory: ProductCategory;
  doorType: DoorType;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
};
