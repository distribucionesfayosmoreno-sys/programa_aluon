export const CUSTOMER_PAYMENT_METHODS = ['TRANSFERENCIA', 'GIRO', 'TARJETA', 'CONTADO'] as const;

export type CustomerPaymentMethod = (typeof CUSTOMER_PAYMENT_METHODS)[number];

export const isCustomerPaymentMethod = (value: string | null | undefined): value is CustomerPaymentMethod =>
  CUSTOMER_PAYMENT_METHODS.includes((value || '').trim().toUpperCase() as CustomerPaymentMethod);

export const normalizeCustomerPaymentMethod = (value: string | null | undefined): CustomerPaymentMethod | '' => {
  const upper = (value || '').trim().toUpperCase();
  return isCustomerPaymentMethod(upper) ? upper : '';
};

export const customerPaymentMethodHint = 'Selecciona una forma de pago';
