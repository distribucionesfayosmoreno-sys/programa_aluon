import { DocumentDrawerTotalsPanel } from './DocumentDrawerTotalsPanel';

type Item = {
  doorModel: string;
  doorType: string;
  widthMm: number;
  heightMm: number;
  m2: number;
  lineTotal: number;
};

type Totals = {
  subtotal: number;
  vatAmount: number;
  total: number;
};

type Props = {
  items: Item[];
  totals: Totals;
  formatEur: (value: number) => string;
  variant?: 'embedded' | 'full';
  onLineClick?: (item: Item) => void;
};

export const DocumentDrawerLinesView = ({ items, totals, formatEur, variant = 'full', onLineClick }: Props) => (
  <div
    className="flex flex-col bg-white"
    style={variant === 'embedded' ? { border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' } : undefined}
  >
    {/* Central lines table area */}
    <div className={variant === 'full' ? 'flex-1 min-h-0 overflow-hidden' : ''}>
      <div
        className="overflow-auto p-2"
        style={variant === 'embedded' ? { maxHeight: 320 } : { height: '100%' }}
      >
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
          <table className="w-full border-collapse" style={{ fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th className="px-3 py-2 text-left" style={{ fontSize: 9, fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', width: 56 }}>
                  #
                </th>
                <th className="px-3 py-2 text-left" style={{ fontSize: 9, fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Producto
                </th>
                <th className="px-3 py-2 text-right" style={{ fontSize: 9, fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', width: 140 }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={`${item.doorModel}:${idx}`}
                  role={onLineClick ? 'button' : undefined}
                  tabIndex={onLineClick ? 0 : undefined}
                  aria-label={onLineClick ? `Ver documento asociado de la línea ${idx + 1}` : undefined}
                  onClick={onLineClick ? () => onLineClick(item) : undefined}
                  onKeyDown={
                    onLineClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onLineClick(item);
                          }
                        }
                      : undefined
                  }
                  className={onLineClick ? 'cursor-pointer transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none' : undefined}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td className="px-3 py-2.5 text-xs font-bold" style={{ color: '#94a3b8' }}>
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-xs font-black" style={{ color: '#0f172a' }}>
                      {item.doorModel} · {item.doorType}
                    </div>
                    <div className="text-xs font-semibold mt-0.5" style={{ color: '#64748b' }}>
                      {item.widthMm}×{item.heightMm} mm · m²: {item.m2.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-xs font-black" style={{ color: '#0f172a' }}>
                    {formatEur(item.lineTotal)}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-8 text-center text-xs font-semibold" style={{ color: '#94a3b8' }}>
                    Sin líneas
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Bottom right totals panel */}
    {variant === 'full' ? (
      <div className="border-t" style={{ borderColor: '#e5e7eb', background: '#ffffff' }}>
        <div className="p-3 flex items-stretch justify-end gap-3">
          <DocumentDrawerTotalsPanel totals={totals} formatEur={formatEur} />
        </div>
      </div>
    ) : null}
  </div>
);
