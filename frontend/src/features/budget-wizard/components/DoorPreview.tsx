import type { ColorHex } from '../BudgetWizard.types';

type Props = {
  color: ColorHex;
};

export const DoorPreview = ({ color }: Props) => {
  const stroke = '#0d1117';
  const handle = color.toLowerCase() === '#000000' ? '#f3f4f6' : '#0d1117';

  return (
    <svg viewBox="0 0 220 160" className="w-full h-auto">
      <rect x="8" y="8" width="204" height="144" rx="18" fill="#ffffff" stroke="#e8eaed" />
      <rect x="40" y="18" width="140" height="124" rx="10" fill={color} stroke={stroke} strokeWidth="2" />
      <rect x="55" y="32" width="110" height="96" rx="8" fill="rgba(255,255,255,0.18)" />
      <rect x="152" y="76" width="16" height="6" rx="3" fill={handle} />
      <circle cx="162" cy="79" r="2" fill={stroke} />
    </svg>
  );
};
