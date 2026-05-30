import type {
  CreateDoorSimulationRequest,
  CreateDoorSimulationResponse,
  DoorSimulationStatusResponse,
  StartInpaintRequest,
  StartInpaintResponse,
} from './DoorVisualSimulation.types';

const assertOk = async (response: Response, fallback: string): Promise<void> => {
  if (response.ok) return;
  const text = await response.text().catch(() => '');
  throw new Error(text || fallback);
};

export const createDoorSimulationJob = async (payload: CreateDoorSimulationRequest): Promise<CreateDoorSimulationResponse> => {
  const response = await fetch('/api/door-visual-simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await assertOk(response, 'Error al crear la simulación');
  return response.json() as Promise<CreateDoorSimulationResponse>;
};

export const startDoorSimulationInpaint = async (jobId: string, payload: StartInpaintRequest): Promise<StartInpaintResponse> => {
  const response = await fetch(`/api/door-visual-simulations/${encodeURIComponent(jobId)}/inpaint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await assertOk(response, 'Error al iniciar el inpainting');
  return response.json() as Promise<StartInpaintResponse>;
};

export const getDoorSimulationStatus = async (jobId: string): Promise<DoorSimulationStatusResponse> => {
  const response = await fetch(`/api/door-visual-simulations/${encodeURIComponent(jobId)}`);
  await assertOk(response, 'Error al consultar el estado');
  return response.json() as Promise<DoorSimulationStatusResponse>;
};

