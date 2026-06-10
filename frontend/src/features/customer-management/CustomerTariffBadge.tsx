import { resolveCustomerTariffLabel } from '../../components/customer-modal/customerTariffOptions';

const TARIFF_STYLES: Record<string, { bg: string; color: string }> = {
  A: { bg: '#fef3c7', color: '#92400e' },
  B: { bg: '#dbeafe', color: '#1e40af' },
};

export const CustomerTariffBadge = ({ value }: { value: string }) => {
  const code = (value || '').trim().toUpperCase();
  if (!code) return <span style={{ color: '#d1d5db' }}>—</span>;

  const style = TARIFF_STYLES[code] ?? { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
      style={{ background: style.bg, color: style.color, fontSize: 10 }}
    >
      {resolveCustomerTariffLabel(code)}
    </span>
  );
};
