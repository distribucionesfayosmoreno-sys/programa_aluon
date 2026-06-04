export type DashboardTimeRange = 'day' | 'week' | 'month' | 'year';

export type DashboardBreakdownItem = {
  id: string;
  label: string;
  amount: number;
  pct: number; // 0..100
  color: string;
  icon: 'briefcase' | 'home' | 'bank' | 'file' | 'food' | 'medicine' | 'shopping' | 'car';
};

export type DashboardTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  atLabel: string;
  tone: 'in' | 'out';
};

export type DashboardMiniTile = {
  id: string;
  label: string;
  amount: number;
  gradientFrom: string;
  gradientTo: string;
};

export type DashboardDocumentRow = {
  id: string;
  type: 'PRESUPUESTO' | 'PEDIDO' | 'ALBARAN' | 'FACTURA' | 'ABONO';
  number: string;
  customerName: string;
  statusLabel: string;
  createdAt: string;
  quoteId: string | null;
};

export type DonutSlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};
