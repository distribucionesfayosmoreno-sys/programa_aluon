import type { CutlistRequest, CutlistResponse } from '../models';

export const generateCutlist = async (payload: CutlistRequest): Promise<CutlistResponse> => {
  const response = await fetch('/api/cutlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al generar el despiece');
  }
  return response.json() as Promise<CutlistResponse>;
};

export const getCutlistById = async (id: string): Promise<CutlistResponse> => {
  const response = await fetch(`/api/cutlists/${encodeURIComponent(id)}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al consultar el despiece');
  }
  return response.json() as Promise<CutlistResponse>;
};
