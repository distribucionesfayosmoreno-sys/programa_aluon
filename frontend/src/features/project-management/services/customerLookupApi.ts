export type CustomerLookupCustomer = {
  id: string;
  nombreComercial: string;
};

type CustomerLookupCustomerApi = {
  id: string;
  nombreComercial?: string | null;
};

const readTextError = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    return text.trim();
  } catch {
    return '';
  }
};

const isCustomerLookupCustomerApi = (value: unknown): value is CustomerLookupCustomerApi => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string';
};

export const searchCustomersByNombreComercial = async (
  query: string,
  signal?: AbortSignal,
): Promise<CustomerLookupCustomer[]> => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return [];
  }

  const response = await fetch(`/api/customers?query=${encodeURIComponent(normalizedQuery)}`, { signal });
  if (!response.ok) {
    const details = await readTextError(response);
    throw new Error(details || `Error buscando clientes (status ${response.status})`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter(isCustomerLookupCustomerApi)
    .map((customer) => ({
      id: customer.id,
      nombreComercial: customer.nombreComercial?.trim() || '',
    }))
    .filter((customer): customer is CustomerLookupCustomer => customer.nombreComercial.length > 0);
};
