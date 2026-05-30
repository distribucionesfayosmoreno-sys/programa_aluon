import type { DashboardMiniTile } from '../Dashboard.types';
type Props = {
  tiles: DashboardMiniTile[];
  formatCurrency: (value: number) => string;
};

export const MiniTiles = ({ tiles, formatCurrency }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {tiles.map(tile => (
        <div
          key={tile.id}
          className="rounded-[16px] p-4 text-white shadow-[0_18px_40px_rgba(16,24,40,0.14)]"
          style={{
            background: `linear-gradient(135deg, ${tile.gradientFrom}, ${tile.gradientTo})`,
          }}
        >
          <div className="text-[12px] font-medium opacity-95">{tile.label}</div>
          <div className="mt-1 text-[18px] font-semibold tabular-nums">{formatCurrency(tile.amount)}</div>
        </div>
      ))}
    </div>
  );
};
