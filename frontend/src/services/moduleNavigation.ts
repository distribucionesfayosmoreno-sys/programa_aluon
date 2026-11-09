import type { ModuleKey } from '../components/Sidebar';
import type { AdminManagementTab } from '../features/admin-management/AdminManagement.types';

const CONFIGURATION_EVENT_NAME = 'aluon:open-configuration';

const EVENT_NAME = 'aluon:navigate-module';
const ADMIN_TAB_EVENT_NAME = 'aluon:open-admin-tab';

type NavigateModuleDetail = {
  module: ModuleKey;
};

type NavigateDocumentDetail = {
  documentId: string;
};

type NavigateAdminTabDetail = {
  tab: AdminManagementTab;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isModuleKey = (value: unknown): value is ModuleKey =>
  typeof value === 'string' && value.length > 0;

const isDocumentId = (value: unknown): value is string =>
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

export const navigateToDocument = (documentId: string): void => {
  window.dispatchEvent(new CustomEvent<NavigateDocumentDetail>('aluon:open-document', { detail: { documentId } }));
};

export const onNavigateToDocument = (handler: (documentId: string) => void): (() => void) => {
  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detailUnknown: unknown = event.detail;
    if (!isRecord(detailUnknown)) return;
    if (!isDocumentId(detailUnknown.documentId)) return;
    handler(detailUnknown.documentId);
  };

  window.addEventListener('aluon:open-document', listener);
  return () => window.removeEventListener('aluon:open-document', listener);
};

export const navigateToAdminTab = (tab: AdminManagementTab): void => {
  window.dispatchEvent(new CustomEvent<NavigateAdminTabDetail>(ADMIN_TAB_EVENT_NAME, { detail: { tab } }));
};

export const onNavigateToAdminTab = (handler: (tab: AdminManagementTab) => void): (() => void) => {
  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent) || !isRecord(event.detail)) return;
    const tab = event.detail.tab;
    if (tab === 'USERS' || tab === 'PRODUCT_FAMILIES' || tab === 'CATALOG_OPTIONS' || tab === 'CATALOG_RULES' || tab === 'DISTRIBUTORS' || tab === 'ORDERS' || tab === 'SOCIAL_MEDIA') {
      handler(tab);
    }
  };
  window.addEventListener(ADMIN_TAB_EVENT_NAME, listener);
  return () => window.removeEventListener(ADMIN_TAB_EVENT_NAME, listener);
};

export const navigateToConfiguration = (id: string): void => {
  window.dispatchEvent(new CustomEvent(CONFIGURATION_EVENT_NAME, { detail: { id } }));
};

export const onNavigateToConfiguration = (handler: (id: string) => void): (() => void) => {
  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent) || !isRecord(event.detail)) return;
    if (typeof event.detail.id === 'string' && event.detail.id) handler(event.detail.id);
  };
  window.addEventListener(CONFIGURATION_EVENT_NAME, listener);
  return () => window.removeEventListener(CONFIGURATION_EVENT_NAME, listener);
};
