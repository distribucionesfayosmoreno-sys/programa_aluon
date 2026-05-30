import type { DonutSlice } from '../../Dashboard.types';
import { dashboardTheme } from '../../dashboardTheme';

type Props = {
  size: number;
  stroke: number;
  slices: DonutSlice[];
  centerTopLabel: string;
  centerAmountLabel: string;
  centerBottomLabel: string;
  centerBottomTone: 'positive' | 'negative';
};

type Segment = {
  id: string;
  color: string;
  dashArray: string;
  dashOffset: number;
};

const buildSegments = (slices: DonutSlice[], circumference: number): Segment[] => {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const gap = 3;
  let offset = 0;

  return slices.map(slice => {
    const rawLen = (slice.value / total) * circumference;
    const len = Math.max(0, rawLen - gap);
    const dashArray = `${len} ${circumference - len}`;
    const dashOffset = -offset;
    offset += rawLen;
    return { id: slice.id, color: slice.color, dashArray, dashOffset };
  });
};

export const DonutChart = ({
  size,
  stroke,
  slices,
  centerTopLabel,
  centerAmountLabel,
  centerBottomLabel,
  centerBottomTone,
}: Props) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = buildSegments(slices, circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_12px_18px_rgba(16,24,40,0.06)]">
        <defs>
          <linearGradient id="donutBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eef2f8" />
            <stop offset="1" stopColor="#f6f8fc" />
          </linearGradient>
        </defs>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#donutBase)"
            strokeWidth={stroke}
            fill="none"
          />
          {segments.map(seg => (
            <circle
              key={seg.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={seg.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 6px 10px rgba(16,24,40,0.06))' }}
            />
          ))}
        </g>
      </svg>

      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="text-[12px] font-medium" style={{ color: dashboardTheme.muted }}>
            {centerTopLabel}
          </div>
          <div className="text-[22px] font-semibold mt-1" style={{ color: dashboardTheme.text }}>
            {centerAmountLabel}
          </div>
          <div
            className="text-[12px] font-semibold mt-1"
            style={{ color: centerBottomTone === 'positive' ? '#16a34a' : '#ef4444' }}
          >
            {centerBottomLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

