const PRODUCT_STEP = 'PRODUCTO';

export const setProductWizardStepInUrl = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  params.set('step', PRODUCT_STEP);
  const search = params.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
};

