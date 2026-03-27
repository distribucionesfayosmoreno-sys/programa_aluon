import type { DoorModel, DoorType } from './models';

export const MODEL_OPTIONS: Array<{ value: DoorModel; label: string; image: string }> = [
  { value: 'PREMIUM', label: 'ALUON Premium', image: '/legacy/aluon/images/aluonPremium.jpg' },
  { value: 'CLASSIC', label: 'ALUON Classic', image: '/legacy/aluon/images/aluonClassic.jpg' },
  { value: 'INOX', label: 'ALUON Inox', image: '/legacy/aluon/images/aluonInox.jpg' },
  { value: 'VENECIANA', label: 'ALUON Veneciana', image: '/legacy/aluon/images/aluonVeneciana.jpg' },
];

export const DOOR_TYPES: Array<{ value: DoorType; label: string }> = [
  { value: 'PEATONAL', label: 'Puerta peatonal' },
  { value: 'ABATIBLE_UNA', label: 'Puerta abatible una hoja' },
  { value: 'ABATIBLE_DOS', label: 'Puerta abatible dos hojas' },
  { value: 'CORREDERA', label: 'Puerta corredera' },
  { value: 'VALLA', label: 'Valla' },
];

export const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

export const IMAGE_CATALOG = {
  logo: '/legacy/aluon/images/logo.png',
  larguero50x80ConPestania: '/legacy/aluon/images/larguero50x80conPestania.jpg',
  marco1: '/legacy/aluon/images/marco1.jpg',
  marco2: '/legacy/aluon/images/marco2.jpg',
  marco2ConPestania: '/legacy/aluon/images/marco2conPestania.jpg',
  marco2ConPestaniaInox: '/legacy/aluon/images/marco2conPestaniaInox.jpg',
  marco3: '/legacy/aluon/images/marco3.jpg',
  marcoInox: '/legacy/aluon/images/marcoInox.jpg',
  corte45: '/legacy/aluon/images/corte45.jpg',
  corte45y90: '/legacy/aluon/images/corte45y90.jpg',
  corte90: '/legacy/aluon/images/corte90.jpg',
  lama200: '/legacy/aluon/images/lama.jpg',
  lama100: '/legacy/aluon/images/lama100.jpg',
  lamaAvion: '/legacy/aluon/images/lamaAvion.jpg',
  lamaInox: '/legacy/aluon/images/lamaInox200.jpg',
  perfilRuedas: '/legacy/aluon/images/perfilRuedasCorredera.jpg',
  posteCierreA: '/legacy/aluon/images/posteDeCierrePuertaCorrederaMontajeA.jpg',
  posteCierreB: '/legacy/aluon/images/posteDeCierrePuertaCorrederaMontajeB.jpg',
  tubo80x50: '/legacy/aluon/images/tubo80x50.jpg',
  tuboInox: '/legacy/aluon/images/tuboInoxidable.jpg',
  tuboRefuerzoMotor: '/legacy/aluon/images/tuboRefuerzoMotor.jpg',
  tuboRefuerzoMotorInox: '/legacy/aluon/images/tuboRefuerzoMotorInox.jpg',
} as const;

export type ImageKey = keyof typeof IMAGE_CATALOG;

export const FORM_TEMPLATES: Record<DoorType, string> = {
  PEATONAL: '/legacy/aluon/formularios/peatonal.jpg',
  ABATIBLE_UNA: '/legacy/aluon/formularios/abatible_una.jpg',
  ABATIBLE_DOS: '/legacy/aluon/formularios/abatible_dos.jpg',
  CORREDERA: '/legacy/aluon/formularios/corredera.jpg',
  VALLA: '/legacy/aluon/formularios/vallas.jpg',
};
