/**
 * Tipos para el sistema de estaciones de producción (cadena de montaje).
 */

export type ProductionStationCode =
  | 'CORTE'
  | 'SOLDADURA'
  | 'MECANIZADO'
  | 'LACADO'
  | 'CONTROL_LACADO'
  | 'ENSAMBLAJE'
  | 'CONTROL_CALIDAD';

export type ProductionStationStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'SKIPPED';

export type ProductionStationDto = {
  id: string;
  stationCode: ProductionStationCode;
  stationLabel: string;
  sequenceOrder: number;
  status: ProductionStationStatus;
  operatorUserId: number | null;
  operatorName: string | null;
  startedAt: string | null;
  completedAt: string | null;
  blockReason: string | null;
  blockedAt: string | null;
  unblockedAt: string | null;
  notes: string | null;
};

export type ProductionStationAdvanceRequest = {
  status: ProductionStationStatus;
  operatorUserId?: number;
  operatorName?: string;
  notes?: string;
};

export type ProductionStationBlockRequest = {
  reason: string;
};

/** Metadatos estáticos de cada estación para la UI. */
export type StationMeta = {
  code: ProductionStationCode;
  label: string;
  icon: string;
  colorClass: string;
};

export const STATION_META: StationMeta[] = [
  { code: 'CORTE',           label: 'Corte',           icon: '🔪', colorClass: '#3b82f6' },
  { code: 'SOLDADURA',       label: 'Soldadura',       icon: '🔥', colorClass: '#f59e0b' },
  { code: 'MECANIZADO',      label: 'Mecanizado',      icon: '⚙️', colorClass: '#8b5cf6' },
  { code: 'LACADO',          label: 'Lacado',           icon: '🎨', colorClass: '#10b981' },
  { code: 'CONTROL_LACADO',  label: 'Ctrl Lacado',     icon: '🔍', colorClass: '#ef4444' },
  { code: 'ENSAMBLAJE',      label: 'Ensamblaje',      icon: '🔧', colorClass: '#06b6d4' },
  { code: 'CONTROL_CALIDAD', label: 'Ctrl Calidad',    icon: '✅', colorClass: '#22c55e' },
];

export const STATUS_LABELS: Record<ProductionStationStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  BLOCKED: 'Bloqueada',
  SKIPPED: 'Omitida',
};

export const STATUS_COLORS: Record<ProductionStationStatus, string> = {
  PENDING: '#9ca3af',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#22c55e',
  BLOCKED: '#ef4444',
  SKIPPED: '#6b7280',
};
