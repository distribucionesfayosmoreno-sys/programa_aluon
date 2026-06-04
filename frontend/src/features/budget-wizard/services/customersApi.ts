export type DeliveryAddressResponse = {
  id: string;
  nombreAlias: string;
  direccion?: string | null;
  cp?: string | null;
  poblacion?: string | null;
  provincia?: string | null;
  telefono?: string | null;
  contacto?: string | null;
};

export type CustomerResponse = {
  id: string;
  nombreComercial?: string | null;
  razonSocial?: string | null;
  email?: string | null;
  telefono?: string | null;
  tarifa?: string | null;
  direccionesEntrega: DeliveryAddressResponse[];
};

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text || 'Error inesperado';
  } catch {
    return 'Error inesperado';
  }
};

export const listCustomers = async (): Promise<CustomerResponse[]> => {
  const response = await fetch('/api/customers');
  if (!response.ok) throw new Error(await readTextError(response));
  return (await response.json()) as CustomerResponse[];
};
