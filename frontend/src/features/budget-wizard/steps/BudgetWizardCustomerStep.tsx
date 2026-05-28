import type { CustomerResponse, DeliveryAddressResponse } from '../services/customersApi';

type Props = {
  customers: CustomerResponse[];
  loading: boolean;
  selectedCustomerId: string;
  selectedDeliveryAddressId: string;
  deliveryAddresses: DeliveryAddressResponse[];
  onCustomerChange: (value: string) => void;
  onDeliveryAddressChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const customerLabel = (customer: CustomerResponse): string => {
  const name = customer.nombreComercial || customer.razonSocial || 'Cliente sin nombre';
  const contact = customer.email || customer.telefono || '';
  return contact ? `${name} (${contact})` : name;
};

const addressLabel = (address: DeliveryAddressResponse): string => {
  const parts = [
    address.nombreAlias,
    address.direccion ?? '',
    address.poblacion ?? '',
    address.provincia ?? '',
  ].filter(Boolean);
  return parts.join(' · ');
};

export const BudgetWizardCustomerStep = ({
  customers,
  loading,
  selectedCustomerId,
  selectedDeliveryAddressId,
  deliveryAddresses,
  onCustomerChange,
  onDeliveryAddressChange,
  onNext,
  onBack,
}: Props) => (
  <section className="grid gap-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Cliente y entrega</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Asocia el presupuesto a un cliente y una dirección.</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Volver</button>
    </div>

    {loading && (
      <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Cargando clientes…</div>
    )}

    <div className="rounded-2xl p-6 grid gap-4" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <div>
        <label className="field-label">Cliente</label>
        <select className="field" value={selectedCustomerId} onChange={e => onCustomerChange(e.target.value)}>
          <option value="">Selecciona cliente…</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{customerLabel(c)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Dirección de entrega (opcional por ahora)</label>
        <select
          className="field"
          value={selectedDeliveryAddressId}
          onChange={e => onDeliveryAddressChange(e.target.value)}
          disabled={!selectedCustomerId}
        >
          <option value="">Sin dirección</option>
          {deliveryAddresses.map(a => (
            <option key={a.id} value={a.id}>{addressLabel(a)}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" onClick={onNext}>Siguiente</button>
      </div>
    </div>
  </section>
);

