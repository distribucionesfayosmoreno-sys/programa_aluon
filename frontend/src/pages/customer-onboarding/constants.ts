import aluonClassicImg from '../../assets/cutlist/aluonClassic.jpg';
import aluonPremiumImg from '../../assets/cutlist/aluonPremium.jpg';
import aluonInoxImg from '../../assets/cutlist/aluonInox.jpg';
import aluonVenecianaImg from '../../assets/cutlist/aluonVeneciana.jpg';
import formPeatonalImg from '../../assets/cutlist/forms/form-peatonal.jpg';
import formAbatibleUnaImg from '../../assets/cutlist/forms/form-abatible-una.jpg';
import formAbatibleDosImg from '../../assets/cutlist/forms/form-abatible-dos.jpg';
import formCorrederaImg from '../../assets/cutlist/forms/form-corredera.jpg';
import formVallaImg from '../../assets/cutlist/forms/form-vallas.jpg';
import type { CatalogCard, ProductTypeCard } from './models';

export const CATALOG_MODELS: CatalogCard[] = [
  {
    id: 'PREMIUM',
    label: 'ALUON Premium',
    image: aluonPremiumImg,
    description: 'Acabado premium con líneas sólidas y detalle técnico.',
  },
  {
    id: 'CLASSIC',
    label: 'ALUON Classic',
    image: aluonClassicImg,
    description: 'Estética equilibrada para proyectos residenciales.',
  },
  {
    id: 'INOX',
    label: 'ALUON Inox',
    image: aluonInoxImg,
    description: 'Refuerzo inoxidable para zonas de alta exigencia.',
  },
  {
    id: 'VENECIANA',
    label: 'ALUON Veneciana',
    image: aluonVenecianaImg,
    description: 'Lamas horizontales con ventilación optimizada.',
  },
];

export const PRODUCT_TYPES: ProductTypeCard[] = [
  {
    id: 'PEATONAL',
    label: 'Puerta Peatonal',
    image: formPeatonalImg,
    description: 'Paso individual con marco reforzado.',
  },
  {
    id: 'CORREDERA',
    label: 'Corredera',
    image: formCorrederaImg,
    description: 'Apertura lateral con guía de rodadura.',
  },
  {
    id: 'ABATIBLE_UNA',
    label: 'Dos hojas (1 hoja)',
    image: formAbatibleUnaImg,
    description: 'Batiente sencillo con opción de automatización.',
  },
  {
    id: 'ABATIBLE_DOS',
    label: 'Dos hojas (2 hojas)',
    image: formAbatibleDosImg,
    description: 'Batiente doble para grandes accesos.',
  },
  {
    id: 'VALLA',
    label: 'Valla',
    image: formVallaImg,
    description: 'Cerramiento modular para perímetros.',
  },
];
