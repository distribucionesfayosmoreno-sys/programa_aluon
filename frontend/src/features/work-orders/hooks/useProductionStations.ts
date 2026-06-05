import { useCallback, useEffect, useState } from 'react';
import type {
  ProductionStationDto,
  ProductionStationCode,
} from '../sections/production/ProductionStation.types';
import {
  fetchProductionStations,
  advanceProductionStation,
  blockProductionStation,
  unblockProductionStation,
} from '../services/productionStationApi';

type UseProductionStationsParams = {
  orderId: string | null;
  canStartProduction: boolean;
};

export type UseProductionStationsResult = ReturnType<typeof useProductionStations>;

export const useProductionStations = ({
  orderId,
  canStartProduction,
}: UseProductionStationsParams) => {
  const [stations, setStations] = useState<ProductionStationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadStations = useCallback(async () => {
    if (!orderId || !canStartProduction) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchProductionStations(orderId);
      setStations(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error cargando estaciones.';
      setError(msg);
      console.error('[production-stations] load failed', err);
    } finally {
      setLoading(false);
    }
  }, [orderId, canStartProduction]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleAdvance = useCallback(async (
    stationCode: ProductionStationCode,
    targetStatus: 'IN_PROGRESS' | 'COMPLETED',
    operatorUserId?: number,
    operatorName?: string,
    notes?: string,
  ) => {
    if (!orderId) return;
    setError('');
    try {
      const updated = await advanceProductionStation(orderId, stationCode, {
        status: targetStatus,
        operatorUserId,
        operatorName,
        notes,
      });
      setStations(prev => prev.map(s =>
        s.stationCode === stationCode ? updated : s
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al avanzar estación.';
      setError(msg);
    }
  }, [orderId]);

  const handleBlock = useCallback(async (
    stationCode: ProductionStationCode,
    reason: string,
  ) => {
    if (!orderId) return;
    setError('');
    try {
      const updated = await blockProductionStation(orderId, stationCode, { reason });
      setStations(prev => prev.map(s =>
        s.stationCode === stationCode ? updated : s
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al bloquear estación.';
      setError(msg);
    }
  }, [orderId]);

  const handleUnblock = useCallback(async (stationCode: ProductionStationCode) => {
    if (!orderId) return;
    setError('');
    try {
      const updated = await unblockProductionStation(orderId, stationCode);
      setStations(prev => prev.map(s =>
        s.stationCode === stationCode ? updated : s
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al desbloquear estación.';
      setError(msg);
    }
  }, [orderId]);

  const completedCount = stations.filter(s => s.status === 'COMPLETED' || s.status === 'SKIPPED').length;
  const totalCount = stations.length || 7;
  const productionPct = Math.round((completedCount / totalCount) * 100);
  const allCompleted = completedCount === totalCount && totalCount > 0;

  const activeStation = stations.find(s =>
    s.status === 'IN_PROGRESS' || s.status === 'BLOCKED'
  ) ?? null;

  const nextPendingStation = stations.find(s => s.status === 'PENDING') ?? null;

  return {
    stations,
    loading,
    error,
    setError,
    productionPct,
    allCompleted,
    completedCount,
    totalCount,
    activeStation,
    nextPendingStation,
    handleAdvance,
    handleBlock,
    handleUnblock,
    loadStations,
  };
};
