import { dashboardTheme } from '../../dashboardTheme';

type Props = {
  width: number;
  height: number;
  points: number[];
  className?: string;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const toCoords = (rawPoints: number[], width: number, height: number) => {
  const points = rawPoints.filter(isFiniteNumber);
  if (points.length === 0) return [];

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  if (points.length === 1) {
    const value = points[0];
    const y = height - ((value - min) / range) * height;
    return [{ x: 0, y }];
  }

  return points.map((value, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });
};

export const LineAreaChart = ({ width, height, points, className }: Props) => {
  const coords = toCoords(points, width, height);
  const line = coords.map(p => `${p.x},${p.y}`).join(' ');
  const area = line.length > 0 ? `${line} ${width},${height} 0,${height}` : '';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={className ?? 'block w-full h-auto'}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(77,163,255,0.35)" />
          <stop offset="1" stopColor="rgba(77,163,255,0.03)" />
        </linearGradient>
      </defs>

      <g opacity="0.7">
        {Array.from({ length: 4 }).map((_, idx) => (
          <line
            key={idx}
            x1={0}
            y1={Math.round((idx / 3) * height)}
            x2={width}
            y2={Math.round((idx / 3) * height)}
            stroke={dashboardTheme.ring}
            strokeWidth={1}
          />
        ))}
      </g>

      {area.length > 0 ? <polygon points={area} fill="url(#trendFill)" /> : null}
      {line.length > 0 ? (
        <polyline
          points={line}
          fill="none"
          stroke="#4da3ff"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
};
