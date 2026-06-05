import { STATION_META, STATUS_LABELS, STATUS_COLORS } from './ProductionStation.types';
import type { ProductionStationDto, ProductionStationCode } from './ProductionStation.types';
import { uiColors } from '../../components/ui';
import type { AdminUser } from '../../../../hooks/useAdminUsers';
import { useState } from 'react';

type ProductionStationCardProps = {
  station: ProductionStationDto;
  canStartStation: boolean;
  availableOperators: AdminUser[];
  onStart: (code: ProductionStationCode, operatorUserId?: number, operatorName?: string) => void;
  onComplete: (code: ProductionStationCode) => void;
  onBlock: (code: ProductionStationCode) => void;
  onUnblock: (code: ProductionStationCode) => void;
  onOpenDocument: () => void;
};

const formatTimestamp = (iso: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const computeDuration = (start: string | null, end: string | null): string => {
  if (!start || !end) return '';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

/** Tarjeta detallada de una estación con acciones contextuales. */
export const ProductionStationCard = ({
  station,
  canStartStation,
  availableOperators,
  onStart,
  onComplete,
  onBlock,
  onUnblock,
  onOpenDocument,
}: ProductionStationCardProps) => {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const meta = STATION_META.find(m => m.code === station.stationCode);
  const statusLabel = STATUS_LABELS[station.status];
  const statusColor = STATUS_COLORS[station.status];

  const isPending = station.status === 'PENDING';
  const isInProgress = station.status === 'IN_PROGRESS';
  const isCompleted = station.status === 'COMPLETED';
  const isBlocked = station.status === 'BLOCKED';

  const borderColor = isBlocked
    ? '#ef4444'
    : isInProgress
      ? meta?.colorClass ?? uiColors.accent
      : isCompleted
        ? '#22c55e'
        : uiColors.border;

  return (
    <div
      className="p-4 rounded-xl transition-all duration-200"
      style={{
        border: `1.5px solid ${borderColor}`,
        background: isBlocked
          ? '#fef2f2'
          : isInProgress
            ? `${meta?.colorClass ?? '#3b82f6'}08`
            : isCompleted
              ? '#f0fdf4'
              : '#fafafa',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta?.icon ?? '📦'}</span>
          <span className="text-sm font-bold uppercase tracking-wide" style={{ color: uiColors.textPrimary }}>
            {station.stationLabel}
          </span>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            color: statusColor,
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}44`,
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3" style={{ color: uiColors.textSubtle }}>
        {station.operatorName && (
          <div>
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: uiColors.textGhost }}>
              Operario
            </span>
            <div className="font-medium" style={{ color: uiColors.textPrimary }}>
              {station.operatorName}
            </div>
          </div>
        )}
        {station.startedAt && (
          <div>
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: uiColors.textGhost }}>
              Inicio
            </span>
            <div className="font-medium">{formatTimestamp(station.startedAt)}</div>
          </div>
        )}
        {station.completedAt && (
          <>
            <div>
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: uiColors.textGhost }}>
                Fin
              </span>
              <div className="font-medium">{formatTimestamp(station.completedAt)}</div>
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: uiColors.textGhost }}>
                Duración
              </span>
              <div className="font-bold" style={{ color: '#22c55e' }}>
                {computeDuration(station.startedAt, station.completedAt)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Block reason */}
      {isBlocked && station.blockReason && (
        <div
          className="text-xs p-2.5 rounded-lg mb-3"
          style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
        >
          <span className="font-bold uppercase tracking-wider text-[10px]">Motivo del bloqueo: </span>
          {station.blockReason}
        </div>
      )}

      {/* Notes */}
      {station.notes && (
        <div className="text-xs mb-3" style={{ color: uiColors.textSubtle }}>
          <span className="font-semibold">Notas: </span>{station.notes}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isPending && canStartStation && (
          <div className="flex items-center gap-2 border rounded-lg p-1" style={{ borderColor: uiColors.border }}>
            <select
              className="text-xs p-1.5 rounded-md outline-none bg-transparent"
              style={{ color: uiColors.textPrimary }}
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
            >
              <option value="">-- Seleccionar operario --</option>
              {availableOperators.map(op => (
                <option key={op.id} value={op.id}>{op.nombre} {op.apellidos}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={() => {
                const op = availableOperators.find(o => o.id === Number(selectedOperatorId));
                onStart(station.stationCode, op?.id, op ? `${op.nombre} ${op.apellidos}` : undefined);
              }}
              disabled={!selectedOperatorId}
              style={{ opacity: selectedOperatorId ? 1 : 0.5 }}
            >
              ▶ Iniciar
            </button>
          </div>
        )}

        {(isInProgress || isPending) && (
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
            style={{
              color: '#3b82f6',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}
            onClick={onOpenDocument}
          >
            📄 Ver Hoja de Despiece
          </button>
        )}

        {isInProgress && (
          <>
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={() => onComplete(station.stationCode)}
            >
              ✅ Completar
            </button>
            <button
              type="button"
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: '#ef4444',
                background: '#fef2f2',
                border: '1px solid #fecaca',
              }}
              onClick={() => onBlock(station.stationCode)}
            >
              🚫 Bloquear
            </button>
          </>
        )}
        {isBlocked && (
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
            style={{
              color: '#f59e0b',
              background: '#fffbeb',
              border: '1px solid #fde68a',
            }}
            onClick={() => onUnblock(station.stationCode)}
          >
            🔓 Desbloquear
          </button>
        )}
        {isCompleted && (
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#22c55e' }}>
            ✓ Estación completada
          </span>
        )}
      </div>
    </div>
  );
};
