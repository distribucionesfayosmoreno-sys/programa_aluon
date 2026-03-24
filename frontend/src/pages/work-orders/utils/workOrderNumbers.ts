export const buildBudgetNumber = (requestId: string | null, date = new Date()) => {
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const ref = (requestId ?? 'GEN').replace('REQ-', '');
  return `P-${yy}${mm}${dd}-${ref}`;
};

export const buildWorkOrderNumber = (requestId: string | null, date = new Date()) => {
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const ref = (requestId ?? 'GEN').replace('REQ-', '');
  return `OT-${yy}${mm}${dd}-${ref}`;
};

export const formatLongDate = (date = new Date(), locale = 'es-ES') => {
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString(locale, opts);
};

export const formatIsoDate = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
