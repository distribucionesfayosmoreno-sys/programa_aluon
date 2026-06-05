import { STATION_META, STATUS_COLORS } from './ProductionStation.types';
import type { ProductionStationDto } from './ProductionStation.types';

type ProductionPipelineProps = {
  stations: ProductionStationDto[];
  productionPct: number;
};

/** Stepper horizontal visual que muestra el progreso de la cadena de montaje. */
export const ProductionPipeline = ({ stations, productionPct }: ProductionPipelineProps) => {
  const getStationStatus = (code: string) =>
    stations.find(s => s.stationCode === code)?.status ?? 'PENDING';

  return (
    <div className="mb-6">
      {/* Barra de progreso global */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="h-2 flex-1 rounded-full overflow-hidden"
          style={{ background: '#e5e7eb' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${productionPct}%`,
              background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
            }}
          />
        </div>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: '#6b7280', minWidth: 36, textAlign: 'right' }}
        >
          {productionPct}%
        </span>
      </div>

      {/* Stepper horizontal */}
      <div className="flex items-center justify-between gap-1">
        {STATION_META.map((meta, idx) => {
          const status = getStationStatus(meta.code);
          const statusColor = STATUS_COLORS[status];
          const isCompleted = status === 'COMPLETED' || status === 'SKIPPED';
          const isActive = status === 'IN_PROGRESS';
          const isBlocked = status === 'BLOCKED';

          return (
            <div key={meta.code} className="flex items-center" style={{ flex: 1 }}>
              <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
                {/* Círculo de la estación */}
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: isActive || isBlocked ? 42 : 36,
                    height: isActive || isBlocked ? 42 : 36,
                    background: isCompleted
                      ? statusColor
                      : isActive
                        ? `${meta.colorClass}22`
                        : isBlocked
                          ? '#fef2f2'
                          : '#f3f4f6',
                    border: `2px solid ${isActive ? meta.colorClass : isBlocked ? '#ef4444' : isCompleted ? statusColor : '#d1d5db'}`,
                    boxShadow: isActive
                      ? `0 0 0 3px ${meta.colorClass}33`
                      : isBlocked
                        ? '0 0 0 3px #ef444433'
                        : 'none',
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      filter: isCompleted ? 'grayscale(100%) brightness(10)' : 'none',
                    }}
                  >
                    {isCompleted ? '✓' : isBlocked ? '⚠' : meta.icon}
                  </span>
                </div>

                {/* Etiqueta */}
                <span
                  className="text-[9px] font-bold uppercase tracking-wider mt-1.5 text-center leading-tight"
                  style={{
                    color: isActive ? meta.colorClass : isBlocked ? '#ef4444' : isCompleted ? '#22c55e' : '#9ca3af',
                    maxWidth: 64,
                  }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Conector entre estaciones */}
              {idx < STATION_META.length - 1 && (
                <div
                  className="h-0.5 flex-1 mx-1 rounded-full transition-all duration-300"
                  style={{
                    background: isCompleted ? '#22c55e' : '#e5e7eb',
                    minWidth: 8,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
