export const openExternalUrl = (url: URL): void => {
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
};

