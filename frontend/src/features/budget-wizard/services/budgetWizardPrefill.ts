const STORAGE_KEY = 'aluon.budget-wizard.prefill.v1';

type PrefillState = {
  customerId: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readRaw = (): unknown => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
};

export const setBudgetWizardPrefillCustomerId = (customerId: string): void => {
  const next: PrefillState = { customerId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const consumeBudgetWizardPrefillCustomerId = (): string | null => {
  const raw = readRaw();
  if (!isRecord(raw)) return null;
  const customerId = raw.customerId;
  if (typeof customerId !== 'string' || customerId.trim().length === 0) return null;
  localStorage.removeItem(STORAGE_KEY);
  return customerId;
};

