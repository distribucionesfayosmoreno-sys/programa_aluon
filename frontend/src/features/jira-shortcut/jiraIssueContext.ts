import type { ResponsiveCategory, ViewportInfo } from './jiraIssueContext.types';

const clampNonNegativeInt = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
};

export const getEnvironmentName = (): string => {
  const fromEnv = import.meta.env.VITE_APP_ENV_NAME;
  if (fromEnv === undefined) return import.meta.env.MODE;
  return fromEnv;
};

export const getViewportInfo = (): ViewportInfo => {
  const width = clampNonNegativeInt(window.innerWidth);
  const height = clampNonNegativeInt(window.innerHeight);
  const devicePixelRatio = Number.isFinite(window.devicePixelRatio) ? window.devicePixelRatio : 1;

  const category: ResponsiveCategory = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

  return {
    category,
    widthPx: width,
    heightPx: height,
    devicePixelRatio,
  };
};

export const formatContextMarkdown = (context: {
  environmentName: string;
  moduleKey: string;
  moduleLabel: string;
  viewport: ViewportInfo;
  url: string;
}): string => {
  return [
    '',
    '---',
    'Contexto',
    `- Entorno: ${context.environmentName}`,
    `- Módulo: ${context.moduleLabel} (${context.moduleKey})`,
    `- Responsive: ${context.viewport.category} (${context.viewport.widthPx}x${context.viewport.heightPx}, dpr ${context.viewport.devicePixelRatio})`,
    `- URL: ${context.url}`,
  ].join('\n');
};

