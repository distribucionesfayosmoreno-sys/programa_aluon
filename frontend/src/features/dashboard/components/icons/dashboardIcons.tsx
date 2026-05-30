import type { ReactNode } from 'react';

type IconProps = { className?: string };

const Svg = ({ children, className }: { children: ReactNode; className?: string }) => (
  <svg className={className ?? 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const DashboardIcons = {
  briefcase: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <path d="M3.5 8.5h17v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V8.5Z" />
      <path d="M3.5 12h17" />
    </Svg>
  ),
  home: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </Svg>
  ),
  bank: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M4 10h16" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M3.5 10 12 4l8.5 6" />
      <path d="M4 18h16" />
    </Svg>
  ),
  file: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8M8 17h6" />
    </Svg>
  ),
  food: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M4 10h16" />
      <path d="M6 10a6 6 0 0 1 12 0v3a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-3Z" />
    </Svg>
  ),
  medicine: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M9 7h6v3h3v6h-3v3H9v-3H6v-6h3V7Z" />
    </Svg>
  ),
  shopping: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M6 7h12l-1 14H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </Svg>
  ),
  car: (props: IconProps) => (
    <Svg className={props.className}>
      <path d="M5 15 7 9h10l2 6" />
      <path d="M6.5 15h11V19a1 1 0 0 1-1 1h-1" />
      <path d="M8 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path d="M16 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </Svg>
  ),
} as const;

