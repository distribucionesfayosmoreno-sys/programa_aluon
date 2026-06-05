import type {
  ProductionStationDto,
  ProductionStationAdvanceRequest,
  ProductionStationBlockRequest,
  ProductionStationCode,
} from '../sections/production/ProductionStation.types';

const BASE_URL = '/api/orders';

/**
 * Obtiene (e inicializa si no existen) las estaciones de una orden.
 */
export const fetchProductionStations = async (orderId: string): Promise<ProductionStationDto[]> => {
  const response = await fetch(`${BASE_URL}/${orderId}/production-stations`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudieron cargar las estaciones de producción.');
  }
  return (await response.json()) as ProductionStationDto[];
};

/**
 * Avanza una estación (iniciar o completar).
 */
export const advanceProductionStation = async (
  orderId: string,
  stationCode: ProductionStationCode,
  request: ProductionStationAdvanceRequest,
): Promise<ProductionStationDto> => {
  const response = await fetch(`${BASE_URL}/${orderId}/production-stations/${stationCode}/advance`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo avanzar la estación.');
  }
  return (await response.json()) as ProductionStationDto;
};

/**
 * Bloquea una estación por incidencia.
 */
export const blockProductionStation = async (
  orderId: string,
  stationCode: ProductionStationCode,
  request: ProductionStationBlockRequest,
): Promise<ProductionStationDto> => {
  const response = await fetch(`${BASE_URL}/${orderId}/production-stations/${stationCode}/block`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo bloquear la estación.');
  }
  return (await response.json()) as ProductionStationDto;
};

/**
 * Desbloquea una estación.
 */
export const unblockProductionStation = async (
  orderId: string,
  stationCode: ProductionStationCode,
): Promise<ProductionStationDto> => {
  const response = await fetch(`${BASE_URL}/${orderId}/production-stations/${stationCode}/unblock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo desbloquear la estación.');
  }
  return (await response.json()) as ProductionStationDto;
};
