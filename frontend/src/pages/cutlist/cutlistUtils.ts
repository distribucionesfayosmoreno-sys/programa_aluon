import type { DoorModel, DoorType } from './models';
import { DOOR_TYPES, IMAGE_CATALOG, MODEL_OPTIONS, type ImageKey } from './cutlistConstants';

const normalizeText = (value: string) => value.toLowerCase();

export const resolveSectionalImage = (description: string): ImageKey | null => {
  const text = normalizeText(description);
  if (text.includes('refuerzo motor') && text.includes('inox')) return 'tuboRefuerzoMotorInox';
  if (text.includes('refuerzo motor')) return 'tuboRefuerzoMotor';
  if (text.includes('perfil ruedas')) return 'perfilRuedas';
  if (text.includes('poste de cierre') && (text.includes('montaje a') || text.includes('sin pestañas'))) return 'posteCierreA';
  if (text.includes('poste de cierre') && (text.includes('montaje b') || text.includes('con pestañas'))) return 'posteCierreB';
  if (text.includes('tubo inoxidable')) return 'tuboInox';
  if (text.includes('tubo 80x50') || text.includes('cola')) return 'tubo80x50';
  if (text.includes('lama 200x26')) return 'lamaInox';
  if (text.includes('lama 200x20')) return 'lama200';
  if (text.includes('lama 100x20')) return 'lama100';
  if (text.includes('lama 100 avión')) return 'lamaAvion';
  if (text.includes('larguero 50x50')) return 'marco1';
  if (text.includes('larguero 50x80') && text.includes('pestaña') && text.includes('inox')) return 'marco2ConPestaniaInox';
  if (text.includes('larguero 50x80') && text.includes('pestaña')) return 'larguero50x80ConPestania';
  if (text.includes('larguero 50x80')) return 'larguero50x80ConPestania';
  if (text.includes('marco') && (text.includes('troquelado') || text.includes('veneciana') || text.includes('50x50'))) return 'tuboRefuerzoMotorInox';
  if (text.includes('marco') && text.includes('80x50') && text.includes('pestaña') && text.includes('inox')) return 'marco2ConPestaniaInox';
  if (text.includes('marco') && text.includes('80x50') && text.includes('pestaña')) return 'marco2ConPestania';
  if (text.includes('marco') && text.includes('80x50') && text.includes('inox')) return 'marcoInox';
  if (text.includes('marco') && text.includes('80x50')) return 'marco2';
  if (text.includes('marco') && text.includes('50x50')) return 'marco1';
  return null;
};

export const resolveLateralImage = (description: string): ImageKey | null => {
  const text = normalizeText(description);
  if (text.includes('recto') && text.includes('inglete 45')) return 'corte45y90';
  if (text.includes('inglete 45')) return 'corte45';
  if (text.includes('corte recto') || text.includes('recto')) return 'corte90';
  return null;
};

export const getImageFormat = (key: ImageKey) => {
  const path = IMAGE_CATALOG[key];
  return path.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
};

export const parseBoolean = (value: '' | 'true' | 'false') => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

export const toNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-ES');
};

export const formatModel = (value?: DoorModel | null) => {
  if (!value) return '-';
  return MODEL_OPTIONS.find(option => option.value === value)?.label ?? value;
};

export const formatDoorType = (value?: DoorType | null) => {
  if (!value) return '-';
  return DOOR_TYPES.find(option => option.value === value)?.label ?? value;
};

export const formatMm = (value?: string | null) => {
  if (!value?.trim()) return '-';
  return `${value} mm`;
};

export const formatYesNo = (value: boolean | null) => {
  if (value === null) return 'Sí [ ]  No [ ]';
  return value ? 'Sí [X]  No [ ]' : 'Sí [ ]  No [X]';
};

export const formatSide = (value: string | null, leftLabel = 'Izq', rightLabel = 'Der') => {
  if (!value) return `${leftLabel} [ ]  ${rightLabel} [ ]`;
  return value === 'LEFT' ? `${leftLabel} [X]  ${rightLabel} [ ]` : `${leftLabel} [ ]  ${rightLabel} [X]`;
};
