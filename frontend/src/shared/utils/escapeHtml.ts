const escapeMap: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, match => escapeMap[match] ?? match);

export const safeText = (value: string | null | undefined, fallback = '—'): string => {
  const trimmed = (value ?? '').trim();
  return trimmed ? escapeHtml(trimmed) : fallback;
};

