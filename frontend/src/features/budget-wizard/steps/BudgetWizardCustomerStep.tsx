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
}: Props) => {
  if (loading) {
    return <div className="text-xs text-secondary animate-pulse py-8 text-center font-body">Cargando clientes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold font-space">Asignación</span>
          <h3 className="font-headline font-bold text-2xl text-on-surface mt-0.5 font-space">Cliente y entrega</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1 active:scale-95 transition-transform font-space"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver
        </button>
      </div>

      <p className="text-xs text-secondary font-body">
        Asocia este presupuesto a un cliente existente y selecciona una dirección de entrega si es necesario.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-secondary font-bold ml-1">Cliente *</label>
          <select
            value={selectedCustomerId}
            onChange={e => onCustomerChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-shadow text-on-surface appearance-none font-medium"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="">Selecciona cliente...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{customerLabel(c)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-secondary font-bold ml-1">Dirección de entrega</label>
          <select
            value={selectedDeliveryAddressId}
            onChange={e => onDeliveryAddressChange(e.target.value)}
            disabled={!selectedCustomerId || deliveryAddresses.length === 0}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-shadow text-on-surface appearance-none disabled:opacity-50 font-medium"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="">Sin dirección / No aplica</option>
            {deliveryAddresses.map(a => (
              <option key={a.id} value={a.id}>{addressLabel(a)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedCustomerId}
          className="bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shadow-md shadow-primary/20"
        >
          Siguiente
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

