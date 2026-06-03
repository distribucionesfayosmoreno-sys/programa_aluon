import type { DoorModel } from '../customer-onboarding/models';

const supportedDoorModels = ['PREMIUM', 'CLASSIC', 'INOX', 'VENECIANA'] as const;

type SupportedDoorModel = (typeof supportedDoorModels)[number];

const isSupportedDoorModel = (value: string): value is SupportedDoorModel =>
  supportedDoorModels.includes(value as SupportedDoorModel);

export const resolveDoorModelForQuote = (value: string): DoorModel | null => {
  const normalized = value.trim().toUpperCase();
  return isSupportedDoorModel(normalized) ? normalized : null;
};

