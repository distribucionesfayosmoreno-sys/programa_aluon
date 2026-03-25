export type CustomerSummary = {
  id: string;
  nombreComercial: string;
  razonSocial?: string | null;
  email?: string | null;
  telefono?: string | null;
};

export const getCustomers = async (): Promise<CustomerSummary[]> => {
  const response = await fetch('/api/customers');
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al cargar clientes');
  }
  return response.json() as Promise<CustomerSummary[]>;
};
