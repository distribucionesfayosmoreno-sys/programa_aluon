const normalizeBaseUrl = (baseUrl: string): string => {
  if (!baseUrl) return '/';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

const encodePathSegments = (path: string): string =>
  path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');

export const budgetWizardPublicPath = (relativePath: string): string => {
  const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL ?? '/');
  const cleaned = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${baseUrl}${encodePathSegments(cleaned)}`;
};

export const budgetWizardIdeasImagePath = (fileName: string): string =>
  budgetWizardPublicPath(`ideas/aluon/images/${fileName}`);

