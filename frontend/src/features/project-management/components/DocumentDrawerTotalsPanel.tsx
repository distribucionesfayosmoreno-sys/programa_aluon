type Totals = {
  subtotal: number;
  vatAmount: number;
  total: number;
};

type Props = {
  totals: Totals;
  formatEur: (value: number) => string;
};

export const DocumentDrawerTotalsPanel = ({ totals, formatEur }: Props) => (
  <div className="w-full max-w-sm rounded-lg border p-3" style={{ borderColor: '#e5e7eb', background: '#ffffff' }}>
    <div className="flex items-center justify-between text-xs" style={{ color: '#475569' }}>
      <span>Base Imponible:</span>
      <span className="font-semibold" style={{ color: '#0f172a' }}>{formatEur(totals.subtotal)}</span>
    </div>
    <div className="flex items-center justify-between text-xs mt-1" style={{ color: '#475569' }}>
      <span>IVA:</span>
      <span className="font-semibold" style={{ color: '#0f172a' }}>{formatEur(totals.vatAmount)}</span>
    </div>

    <div className="mt-3 text-xs font-black uppercase tracking-wide" style={{ color: '#1d4ed8' }}>
      Total a pagar:
    </div>
    <div className="text-2xl font-black mt-0.5 text-right" style={{ color: '#1d4ed8' }}>
      {formatEur(totals.total)}
    </div>
  </div>
);

