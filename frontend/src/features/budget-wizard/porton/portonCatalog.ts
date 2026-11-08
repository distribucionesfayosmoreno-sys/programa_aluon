import type { DoorType } from '../../customer-onboarding/models';
import type { ProductCategory } from '../BudgetWizard.types';

export type PortonConfiguration = {
  variantCode: string;
  panelCode: string;
  orientation: 'HORIZONTAL' | 'VERTICAL';
  finishCode: string;
  customRal: string | null;
  motorized: boolean;
  safetyPhotocell: boolean;
  safetyEdge: boolean;
  guide: 'EMPOTRADA' | 'SUPERFICIE' | 'SIN_GUIA' | null;
  closingProfile: 'SOLAPADO' | 'SUPERFICIE' | null;
};
export type PortonVariant = {
  code: string;
  label: string;
  doorType: DoorType;
  productCategory: ProductCategory;
  minWidthMm: number | null;
  maxWidthMm: number;
  minHeightMm: number | null;
  maxHeightMm: number;
  motorAllowed: boolean;
  panelCodes: string[];
};
export type PortonCatalog = {
  source: string;
  notes: string[];
  variants: PortonVariant[];
  panels: { code: string; label: string; kgPerM2: number | null }[];
  finishes: { code: string; label: string; group: string }[];
};
export const isSliding = (variant: PortonVariant) => variant.doorType === 'CORREDERA';
export const defaultPortonConfiguration = (variant: PortonVariant): PortonConfiguration => ({
  variantCode: variant.code,
  panelCode: variant.panelCodes[0],
  orientation: 'HORIZONTAL',
  finishCode: 'RAL_7016_TM',
  customRal: null,
  motorized: false,
  safetyPhotocell: false,
  safetyEdge: false,
  guide: isSliding(variant) ? 'SUPERFICIE' : null,
  closingProfile: isSliding(variant) || variant.code.startsWith('PIVOTANTE') ? 'SOLAPADO' : null,
});

export const portonErrors = (catalog: PortonCatalog | null, config: PortonConfiguration | null | undefined,
  width: number, height: number, clearance: number): string[] => {
  if (!config) return [];
  if (!catalog) return ['No se ha podido cargar la referencia técnica de portones.'];
  const v = catalog.variants.find(v => v.code === config.variantCode);
  if (!v) return ['Selecciona una variante válida.'];
  const errors: string[] = [];
  if (!Number.isInteger(width) || width <= 0 || width < (v.minWidthMm ?? 1) || width > v.maxWidthMm)
    errors.push(`Ancho: ${v.minWidthMm ?? '> 0'}–${v.maxWidthMm} mm.`);
  if (!Number.isInteger(height) || height <= 0 || height < (v.minHeightMm ?? 1) || height > v.maxHeightMm)
    errors.push(`Alto: ${v.minHeightMm ?? '> 0'}–${v.maxHeightMm} mm.`);
  if (v.code.startsWith('PEATONAL') && (!Number.isInteger(clearance) || clearance < 10 || clearance > 15))
    errors.push('La holgura inferior de la peatonal debe estar entre 10 y 15 mm.');
  if (!v.panelCodes.includes(config.panelCode)) errors.push('Panel incompatible con la variante.');
  if (v.code === 'VALLADO_HORIZONTAL' && config.orientation !== 'HORIZONTAL') errors.push('El vallado horizontal requiere panel horizontal.');
  if (config.finishCode === 'OTRO_RAL' && !/^\d{4}$/.test(config.customRal ?? '')) errors.push('Introduce un RAL de cuatro cifras.');
  if (config.motorized && !v.motorAllowed) errors.push('Esta variante no admite motor.');
  if (config.motorized && !config.safetyPhotocell && !config.safetyEdge) errors.push('Selecciona fotocélula y/o banda resistiva para el motor.');
  return errors;
};

export const describePorton = (catalog: PortonCatalog | null, c: PortonConfiguration | null): string => {
  if (!catalog || !c) return '';
  return [catalog.variants.find(v => v.code === c.variantCode)?.label,
    `Panel: ${c.panelCode} · ${c.orientation.toLowerCase()}`,
    `Acabado: ${catalog.finishes.find(f => f.code === c.finishCode)?.label ?? c.finishCode}${c.customRal ? ` ${c.customRal}` : ''}`,
    c.guide ? `Guía: ${c.guide.toLowerCase().replace('_', ' ')}` : '',
    c.closingProfile ? `Cierre: ${c.closingProfile.toLowerCase()}` : '',
    c.motorized ? 'Motorizado' : 'Manual / fijo', c.safetyPhotocell ? 'Fotocélula' : '', c.safetyEdge ? 'Banda resistiva' : '',
    'Panel, acabado, motor y accesorios pendientes de valoración',
  ].filter(Boolean).join(' · ');
};
