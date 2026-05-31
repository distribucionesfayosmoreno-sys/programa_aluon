import type { ModuleKey } from '../components/Sidebar';

const EVENT_NAME = 'aluon:navigate-module';

type NavigateModuleDetail = {
  module: ModuleKey;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isModuleKey = (value: unknown): value is ModuleKey =>
  typeof value === 'string' && value.length > 0;

export const navigateToModule = (module: ModuleKey): void => {
  window.dispatchEvent(new CustomEvent<NavigateModuleDetail>(EVENT_NAME, { detail: { module } }));
};

export const onNavigateToModule = (handler: (module: ModuleKey) => void): (() => void) => {
  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detailUnknown: unknown = event.detail;
    if (!isRecord(detailUnknown)) return;
    if (!isModuleKey(detailUnknown.module)) return;
    handler(detailUnknown.module);
  };

  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
};

