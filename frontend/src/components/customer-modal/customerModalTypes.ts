import { Customer } from '../../hooks/useCustomers';

export type TabKey = 'GENERAL' | 'ADDRESSES';

export interface CustomerModalProps {
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}
