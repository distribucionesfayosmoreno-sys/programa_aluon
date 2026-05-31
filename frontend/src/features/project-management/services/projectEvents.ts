export type ProjectEventName = 'projects:changed';

export const PROJECT_EVENTS = {
  changed: 'projects:changed' as const,
};

export const emitProjectsChanged = (): void => {
  window.dispatchEvent(new CustomEvent<ProjectEventName>(PROJECT_EVENTS.changed));
};

export const onProjectsChanged = (handler: () => void): (() => void) => {
  const listener = () => handler();
  window.addEventListener(PROJECT_EVENTS.changed, listener);
  return () => window.removeEventListener(PROJECT_EVENTS.changed, listener);
};

