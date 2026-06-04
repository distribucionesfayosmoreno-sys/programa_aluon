import { dashboardTheme } from '../dashboard/dashboardTheme';

export const documentManagementTheme = {
  pageBg: 'linear-gradient(180deg, #f8f9fb 0%, #eef1f6 100%)',
  panelBg: dashboardTheme.surface,
  panelSoftBg: dashboardTheme.surfaceSoft,
  border: dashboardTheme.border,
  text: dashboardTheme.text,
  muted: dashboardTheme.muted,
  shadow: dashboardTheme.shadow,
  shadowSoft: dashboardTheme.shadowSoft,
  ring: dashboardTheme.ring,
  accent: '#2563eb',
  accentBg: '#dbeafe',
  accentText: '#1d4ed8',
  successBg: '#ecfdf3',
  successText: '#027a48',
  warningBg: '#fffaeb',
  warningText: '#b54708',
  infoBg: '#eff6ff',
  infoText: '#1d4ed8',
} as const;
