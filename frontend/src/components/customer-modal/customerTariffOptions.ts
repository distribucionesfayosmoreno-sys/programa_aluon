export type CustomerTariffCode = 'A' | 'B';

export type CustomerTariffOption = {
  value: CustomerTariffCode;
  label: string;
};

export const DEFAULT_CUSTOMER_TARIFF_OPTIONS: CustomerTariffOption[] = [
  { value: 'A', label: 'TARIFA A (CLIENTES HABITUALES)' },
  { value: 'B', label: 'TARIFA B (CLIENTES NUEVOS)' },
];

const normalizeRawTariff = (value: string | null | undefined): string =>
  (value ?? '').trim().toUpperCase();

export const normalizeCustomerTariffCode = (value: string | null | undefined): CustomerTariffCode => {
  const normalized = normalizeRawTariff(value);
  if (normalized === 'B' || normalized.includes('NUEV')) {
    return 'B';
  }
  return 'A';
};

export const resolveCustomerTariffLabel = (value: string | null | undefined): string => (
  normalizeCustomerTariffCode(value) === 'B'
    ? 'TARIFA B (CLIENTES NUEVOS)'
    : 'TARIFA A (CLIENTES HABITUALES)'
);

export const parseCustomerTariffOptions = (value: unknown): CustomerTariffOption[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_CUSTOMER_TARIFF_OPTIONS;
  }

  const options = value.flatMap(entry => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const rawValue = typeof record.value === 'string' ? record.value : typeof record.code === 'string' ? record.code : '';
    const label = typeof record.label === 'string' ? record.label : '';
    const normalized = normalizeCustomerTariffCode(rawValue);
    return label ? [{ value: normalized, label }] : [];
  });

  return options.length > 0 ? options : DEFAULT_CUSTOMER_TARIFF_OPTIONS;
};
