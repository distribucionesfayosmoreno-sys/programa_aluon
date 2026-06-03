import aluonClassicImg from '../../assets/cutlist/aluonClassic.jpg';
import aluonPremiumImg from '../../assets/cutlist/aluonPremium.jpg';
import aluonInoxImg from '../../assets/cutlist/aluonInox.jpg';
import aluonVenecianaImg from '../../assets/cutlist/aluonVeneciana.jpg';
import formPeatonalImg from '../../assets/cutlist/forms/form-peatonal.jpg';
import formAbatibleUnaImg from '../../assets/cutlist/forms/form-abatible-una.jpg';
import formAbatibleDosImg from '../../assets/cutlist/forms/form-abatible-dos.jpg';
import formCorrederaImg from '../../assets/cutlist/forms/form-corredera.jpg';
import formVallaImg from '../../assets/cutlist/forms/form-vallas.jpg';

import type { DoorType } from '../customer-onboarding/models';
import type { ProductCategory } from './BudgetWizard.types';

export const modelImageByDoorModel = (modelo: string): string => {
  switch (modelo) {
    case 'PREMIUM':
      return aluonPremiumImg;
    case 'CLASSIC':
      return aluonClassicImg;
    case 'INOX':
      return aluonInoxImg;
    case 'VENECIANA':
      return aluonVenecianaImg;
    default:
      return aluonPremiumImg;
  }
};

export const productImageByCategory = (category: ProductCategory): string => {
  switch (category) {
    case 'PUERTA_PASO':
      return formPeatonalImg;
    case 'PUERTA_GARAJE':
      return formCorrederaImg;
    case 'VALLA':
      return formVallaImg;
    case 'REJA':
      return formPeatonalImg;
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
};

export const variantImageByDoorType = (variant: DoorType): string => {
  switch (variant) {
    case 'PEATONAL':
      return formPeatonalImg;
    case 'CORREDERA':
      return formCorrederaImg;
    case 'ABATIBLE_UNA':
      return formAbatibleUnaImg;
    case 'ABATIBLE_DOS':
      return formAbatibleDosImg;
    case 'VALLA':
      return formVallaImg;
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
};
