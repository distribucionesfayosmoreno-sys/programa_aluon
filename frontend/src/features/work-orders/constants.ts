import aluonClassicImg from '../../assets/cutlist/aluonClassic.jpg';
import aluonPremiumImg from '../../assets/cutlist/aluonPremium.jpg';
import aluonInoxImg from '../../assets/cutlist/aluonInox.jpg';
import aluonVenecianaImg from '../../assets/cutlist/aluonVeneciana.jpg';
import corte45Img from '../../assets/cutlist/corte45.jpg';
import corte90Img from '../../assets/cutlist/corte90.jpg';
import corte45y90Img from '../../assets/cutlist/corte45y90.jpg';
import type { CutlistDoorModel, CutlistDoorType, CutlistImage, WorkOrderRequest, WorkOrderStage } from './models';

export const MODELS = [
  { id: 'CLASSIC', label: 'ALUON Classic', pricePerM2: 140 },
  { id: 'PRO', label: 'ALUON Pro', pricePerM2: 190 },
  { id: 'LUX', label: 'ALUON Lux', pricePerM2: 260 },
];

export const DOOR_MODELS = [
  { id: 'PREMIUM', label: 'ALUON Premium' },
  { id: 'CLASSIC', label: 'ALUON Classic' },
  { id: 'INOX', label: 'ALUON Inox' },
  { id: 'VENECIANA', label: 'ALUON Veneciana' },
];

export const DOOR_TYPES = [
  { id: 'PEATONAL', label: 'Peatonal' },
  { id: 'ABATIBLE_UNA', label: 'Abatible 1 hoja' },
  { id: 'ABATIBLE_DOS', label: 'Abatible 2 hojas' },
  { id: 'CORREDERA', label: 'Corredera' },
  { id: 'VALLA', label: 'Valla' },
];

export const MOCK_REQUESTS: WorkOrderRequest[] = [
  {
    id: 'REQ-001',
    customerName: 'Maderas Sierra Norte',
    modelId: 'PRO',
    m2: 42.5,
    reference: 'MOD-PR-442',
    googleView: true,
    notes: 'Acabado satinado. Entrega urgente.',
    requestDate: '2026-03-20',
    workflowStep: 'BUDGET',
  },
  {
    id: 'REQ-002',
    customerName: 'Construcciones Lumbre',
    modelId: 'CLASSIC',
    m2: 18,
    reference: 'MOD-CL-107',
    googleView: false,
    notes: 'Medidas especiales en esquinas.',
    requestDate: '2026-03-18',
    workflowStep: 'REQUEST',
  },
  {
    id: 'REQ-003',
    customerName: 'Grupo Arista',
    modelId: 'LUX',
    m2: 64,
    reference: 'MOD-LX-880',
    googleView: true,
    notes: 'Necesita simulación en tienda.',
    requestDate: '2026-03-16',
    workflowStep: 'INBOX',
  },
];

export const WORKFLOW_STEP_LABELS: Record<WorkOrderStage, string> = {
  INBOX: 'Solicitud recibida',
  REQUEST: 'Solicitud en curso',
  BUDGET: 'Presupuesto',
  VALIDATION: 'Validación',
  DEV: 'Desarrollo',
  PROD: 'Producción',
  FINAL: 'Finalización',
};

export const CUTLIST_MODEL_IMAGES: Record<CutlistDoorModel, CutlistImage> = {
  PREMIUM: { src: aluonPremiumImg, alt: 'ALUON Premium', label: 'Modelo Premium' },
  CLASSIC: { src: aluonClassicImg, alt: 'ALUON Classic', label: 'Modelo Classic' },
  INOX: { src: aluonInoxImg, alt: 'ALUON Inox', label: 'Modelo Inox' },
  VENECIANA: { src: aluonVenecianaImg, alt: 'ALUON Veneciana', label: 'Modelo Veneciana' },
};

export const CUTLIST_TYPE_IMAGES: Record<CutlistDoorType, CutlistImage[]> = {
  PEATONAL: [
    { src: corte90Img, alt: 'Corte 90°', label: 'Marco (90°)' },
    { src: corte45Img, alt: 'Corte 45°', label: 'Esquinas (45°)' },
  ],
  ABATIBLE_UNA: [
    { src: corte45Img, alt: 'Corte 45°', label: 'Esquinas (45°)' },
    { src: corte90Img, alt: 'Corte 90°', label: 'Marco (90°)' },
  ],
  ABATIBLE_DOS: [
    { src: corte45Img, alt: 'Corte 45°', label: 'Esquinas (45°)' },
    { src: corte90Img, alt: 'Corte 90°', label: 'Marco (90°)' },
  ],
  CORREDERA: [
    { src: corte45y90Img, alt: 'Corte 45° y 90°', label: 'Esquinas mixtas' },
    { src: corte90Img, alt: 'Corte 90°', label: 'Marco recto' },
  ],
  VALLA: [
    { src: corte90Img, alt: 'Corte 90°', label: 'Marco (90°)' },
    { src: corte45Img, alt: 'Corte 45°', label: 'Esquinas (45°)' },
  ],
};
