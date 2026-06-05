import { useState } from 'react';
import { cardStyle, SectionTitle, uiColors } from '../components/ui';
import { ProductionPipeline } from './production/ProductionPipeline';
import { ProductionStationCard } from './production/ProductionStationCard';
import { ProductionBlockDialog } from './production/ProductionBlockDialog';
import { STATION_META } from './production/ProductionStation.types';
import type { UseProductionStationsResult } from '../hooks/useProductionStations';
import type { ProductionStationCode } from './production/ProductionStation.types';
import { useAdminUsers } from '../../../hooks/useAdminUsers';

const FACTORY_ROLES = ['SOLDADOR', 'MONTADOR', 'ALMACEN'];

type ProductionSectionProps = {
  production: UseProductionStationsResult;
  canStartProduction: boolean;
  cutlistGenerated: boolean;
  cutlistResult: boolean;
  onOpenWorkOrderModal: () => void;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
};

export const ProductionSection = ({
  production,
  canStartProduction,
  cutlistGenerated,
  cutlistResult,
  onOpenWorkOrderModal,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
}: ProductionSectionProps) => {
  const [blockTarget, setBlockTarget] = useState<ProductionStationCode | null>(null);
  const { users } = useAdminUsers();

  const availableOperators = users.filter(u => FACTORY_ROLES.includes(u.role));

  const {
    stations,
    loading,
    error,
    productionPct,
    activeStation,
    nextPendingStation,
    handleAdvance,
    handleBlock,
    handleUnblock,
  } = production;

  const onStart = (code: ProductionStationCode, operatorUserId?: number, operatorName?: string) =>
    handleAdvance(code, 'IN_PROGRESS', operatorUserId, operatorName);

  const onComplete = (code: ProductionStationCode) =>
    handleAdvance(code, 'COMPLETED');

  const onBlockRequest = (code: ProductionStationCode) =>
    setBlockTarget(code);

  const onBlockConfirm = (code: ProductionStationCode, reason: string) => {
    handleBlock(code, reason);
    setBlockTarget(null);
  };

  /** Determina si una estación PENDING puede iniciarse (la anterior está COMPLETED). */
  const canStartStation = (code: ProductionStationCode): boolean => {
    const station = stations.find(s => s.stationCode === code);
    if (!station || station.status !== 'PENDING') return false;
    if (station.sequenceOrder <= 1) return true;
    const prev = stations.find(s => s.sequenceOrder === station.sequenceOrder - 1);
    return prev?.status === 'COMPLETED' || prev?.status === 'SKIPPED';
  };

  /** Estación a mostrar en detalle: la activa, o la siguiente pendiente. */
  const focusedStation = activeStation ?? nextPendingStation;

  const blockTargetLabel = blockTarget
    ? STATION_META.find(m => m.code === blockTarget)?.label ?? ''
    : '';

  return (
    <section className="p-6 rounded-2xl" style={cardStyle}>
      <SectionTitle n="05" label="Producción — Cadena de montaje" />

      {!canStartProduction && (
        <p className="text-xs mt-1 mb-4" style={{ color: uiColors.textGhost }}>
          Producción habilitada tras aprobación y desarrollo.
        </p>
      )}

      {canStartProduction && (
        <>
          {loading && (
            <p className="text-xs mb-4" style={{ color: uiColors.textSubtle }}>
              Cargando estaciones…
            </p>
          )}

          {error && (
            <p className="text-xs font-semibold mb-4" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}

          {stations.length > 0 && (
            <>
              {/* Pipeline visual */}
              <ProductionPipeline stations={stations} productionPct={productionPct} />

              {/* Estación activa en detalle */}
              {focusedStation && (
                <div className="mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest mb-2 block"
                    style={{ color: uiColors.textGhost }}
                  >
                    {activeStation ? 'Estación activa' : 'Siguiente estación'}
                  </span>
                  <ProductionStationCard
                    station={focusedStation}
                    canStartStation={canStartStation(focusedStation.stationCode)}
                    availableOperators={availableOperators}
                    onStart={onStart}
                    onComplete={onComplete}
                    onBlock={onBlockRequest}
                    onUnblock={handleUnblock}
                    onOpenDocument={onOpenWorkOrderModal}
                  />
                </div>
              )}

              {/* Historial de estaciones completadas */}
              {stations.some(s => s.status === 'COMPLETED') && (
                <div className="mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest mb-2 block"
                    style={{ color: uiColors.textGhost }}
                  >
                    Historial completado
                  </span>
                  <div className="space-y-2">
                    {stations
                      .filter(s => s.status === 'COMPLETED')
                      .map(s => (
                        <ProductionStationCard
                          key={s.id}
                          station={s}
                          canStartStation={false}
                          availableOperators={availableOperators}
                          onStart={onStart}
                          onComplete={onComplete}
                          onBlock={onBlockRequest}
                          onUnblock={handleUnblock}
                          onOpenDocument={onOpenWorkOrderModal}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Imprimir orden de trabajo */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={!cutlistGenerated || !cutlistResult}
          onClick={onOpenWorkOrderModal}
          style={{
            opacity: cutlistGenerated && cutlistResult ? 1 : 0.5,
            cursor: cutlistGenerated && cutlistResult ? 'pointer' : 'not-allowed',
          }}
        >
          Imprimir orden de trabajo
        </button>
        {!cutlistGenerated && (
          <span className="text-xs font-semibold" style={{ color: uiColors.textGhost }}>
            Genera el despiece para habilitar la impresión.
          </span>
        )}
      </div>

      {/* Avanzar etapa */}
      {onAdvanceStep && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={onAdvanceStep}
            disabled={!canAdvanceStep}
            style={{
              opacity: canAdvanceStep ? 1 : 0.5,
              cursor: canAdvanceStep ? 'pointer' : 'not-allowed',
            }}
            title={advanceHint || undefined}
          >
            <span className="text-base">➡️</span>
            Avanzar etapa{nextStepLabel ? ` · ${nextStepLabel}` : ''}
          </button>
          {advanceHint && (
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: uiColors.textGhost }}
            >
              {advanceHint}
            </span>
          )}
        </div>
      )}

      {/* Block dialog */}
      <ProductionBlockDialog
        open={blockTarget !== null}
        stationCode={blockTarget}
        stationLabel={blockTargetLabel}
        onConfirm={onBlockConfirm}
        onClose={() => setBlockTarget(null)}
      />
    </section>
  );
};
