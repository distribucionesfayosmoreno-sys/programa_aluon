import type { RegistrationRequest, RegistrationResponse } from '../models';

export const createRegistration = async (payload: RegistrationRequest) => {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al registrar el cliente');
  }
  return (await response.json()) as RegistrationResponse;
};

export const getRegistrationStatus = async (registrationId: string) => {
  const response = await fetch(`/api/registrations/${registrationId}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al consultar el estado');
  }
  return (await response.json()) as RegistrationResponse;
};
