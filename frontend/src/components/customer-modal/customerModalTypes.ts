import { Customer } from '../../hooks/useCustomers';

export type TabKey = 'GENERAL' | 'ADDRESSES';

export interface CustomerModalProps {
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Customer) => Promise<void>;
  onOpenBudget?: (customer: Customer) => void;
  onOpenVision360?: (customer: Customer) => void;
}
