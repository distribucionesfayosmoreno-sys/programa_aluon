import { useMemo, useState } from 'react';
import { dashboardTheme } from '../dashboardTheme';
import type {
  DashboardBreakdownItem,
  DashboardMiniTile,
  DashboardTimeRange,
  DashboardTransaction,
  DonutSlice,
} from '../Dashboard.types';
import { useDashboardFinance } from './useDashboardFinance';
import { useDashboardWorkflow } from './useDashboardWorkflow';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

type DonutCardModel = {
  title: 'Ingresos' | 'Gastos';
  totalLabel: string;
  totalAmount: number;
  innerDeltaLabel: string;
  innerDeltaAmount: number;
  slices: DonutSlice[];
  legend: Array<{ id: string; label: string; color: string }>;
};

export type DashboardViewModel = {
  incomeRange: DashboardTimeRange;
  expensesRange: DashboardTimeRange;
  onIncomeRangeChange: (range: DashboardTimeRange) => void;
  onExpensesRangeChange: (range: DashboardTimeRange) => void;
  income: DonutCardModel;
  expenses: DonutCardModel;
  incomeOverview: DashboardBreakdownItem[];
  expensesOverview: DashboardBreakdownItem[];
  tiles: DashboardMiniTile[];
  trend: { points: number[]; monthLabel: string };
  transactions: DashboardTransaction[];
  paymentIssues: Array<{ id: string; label: string; value: number }>;
  histogram: Array<{ id: string; label: string; value: number }>;
  presupuestos: {
    counts: Array<{ id: string; label: string; value: number }>;
    recent: Array<{ id: string; label: string; estado: string; total: number; fechaIso: string }>;
  };
  ordenes: {
    byStep: Array<{ id: string; label: string; value: number }>;
    recent: Array<{ id: string; codigo: string; cliente: string; etapa: string; estado: string; fechaIso: string; asignadoA: string | null }>;
  };
  formatCurrency: (value: number) => string;
};

const clampPct = (pct: number) => Math.max(0, Math.min(100, pct));

const parseIsoDayLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const toIcon = (label: string): DashboardBreakdownItem['icon'] => {
  const normalized = label.trim().toLowerCase();
  if (normalized.includes('premium') || normalized.includes('classic')) return 'briefcase';
  if (normalized.includes('inox')) return 'bank';
  if (normalized.includes('venec')) return 'file';
  return 'home';
};

export const useDashboardViewModel = (): DashboardViewModel => {
  const [incomeRange, setIncomeRange] = useState<DashboardTimeRange>('month');
  const [expensesRange, setExpensesRange] = useState<DashboardTimeRange>('month');
  const { finance } = useDashboardFinance(incomeRange);
  const { workflow } = useDashboardWorkflow(incomeRange);

  const incomeTotal = finance.income.total;
  const expensesTotal = finance.expenses.total;
  const savingTotal = Math.max(0, incomeTotal - expensesTotal);
  const investmentsTotal = finance.tiles.find(t => t.id === 'investments')?.amount ?? 0;

  const income = useMemo<DonutCardModel>(() => {
    const palette = [
      dashboardTheme.donut.green,
      dashboardTheme.donut.indigo,
      dashboardTheme.donut.pink,
      dashboardTheme.donut.orange,
      dashboardTheme.donut.blue,
      dashboardTheme.donut.purple,
      dashboardTheme.donut.teal,
      dashboardTheme.donut.gray,
    ];
    const slices: DonutSlice[] = finance.income.slices.map((slice, idx) => ({
      id: slice.id,
      label: slice.label,
      value: slice.value,
      color: palette[idx % palette.length],
    }));
    return {
      title: 'Ingresos',
      totalLabel: 'Total',
      totalAmount: incomeTotal,
      innerDeltaLabel: 'Δ',
      innerDeltaAmount: expensesTotal,
      slices,
      legend: slices.map(({ id, label, color }) => ({ id, label, color })),
    };
  }, [finance.income.slices, incomeTotal, expensesTotal]);

  const expenses = useMemo<DonutCardModel>(() => {
    const palette = [
      dashboardTheme.donut.blue,
      dashboardTheme.donut.purple,
      dashboardTheme.donut.red,
      dashboardTheme.donut.orange,
      dashboardTheme.donut.green,
      dashboardTheme.donut.indigo,
      dashboardTheme.donut.brown,
      dashboardTheme.donut.pink,
    ];
    const slices: DonutSlice[] = finance.expenses.slices.map((slice, idx) => ({
      id: slice.id,
      label: slice.label,
      value: slice.value,
      color: palette[idx % palette.length],
    }));
    return {
      title: 'Gastos',
      totalLabel: 'Total',
      totalAmount: expensesTotal,
      innerDeltaLabel: 'Δ',
      innerDeltaAmount: savingTotal,
      slices,
      legend: slices.map(({ id, label, color }) => ({ id, label, color })),
    };
  }, [finance.expenses.slices, expensesTotal, savingTotal]);

  const incomeOverview = useMemo<DashboardBreakdownItem[]>(() => {
    const total = finance.income.total || 1;
    return finance.income.slices.slice(0, 4).map((slice, idx) => {
      const pct = clampPct(Math.round((slice.value / total) * 100));
      const color = income.slices[idx]?.color ?? dashboardTheme.donut.green;
      return {
        id: slice.id,
        label: slice.label,
        amount: slice.value,
        pct,
        color,
        icon: toIcon(slice.label),
      };
    });
  }, [finance.income.slices, finance.income.total, income.slices]);

  const expensesOverview = useMemo<DashboardBreakdownItem[]>(() => {
    const total = finance.expenses.total || 1;
    return finance.expenses.slices.slice(0, 4).map((slice, idx) => {
      const pct = clampPct(Math.round((slice.value / total) * 100));
      const color = expenses.slices[idx]?.color ?? dashboardTheme.donut.blue;
      return {
        id: slice.id,
        label: slice.label,
        amount: slice.value,
        pct,
        color,
        icon: toIcon(slice.label),
      };
    });
  }, [finance.expenses.slices, finance.expenses.total, expenses.slices]);

  const tiles = useMemo<DashboardMiniTile[]>(() => ([
    { id: 'expenses', label: 'Expenses', amount: expensesTotal, gradientFrom: dashboardTheme.tiles.expenses.from, gradientTo: dashboardTheme.tiles.expenses.to },
    { id: 'saving', label: 'Saving', amount: savingTotal, gradientFrom: dashboardTheme.tiles.saving.from, gradientTo: dashboardTheme.tiles.saving.to },
    { id: 'income', label: 'Income', amount: incomeTotal, gradientFrom: dashboardTheme.tiles.income.from, gradientTo: dashboardTheme.tiles.income.to },
    { id: 'investments', label: 'Investments', amount: investmentsTotal, gradientFrom: dashboardTheme.tiles.investments.from, gradientTo: dashboardTheme.tiles.investments.to },
  ]), [expensesTotal, savingTotal, incomeTotal, investmentsTotal]);

  const trend = useMemo(() => ({
    monthLabel: finance.trend.label,
    points: finance.trend.points.map(p => p.value),
  }), [finance.trend.label, finance.trend.points]);

  const transactions = useMemo<DashboardTransaction[]>(() => ([
    ...finance.transactions.map(t => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      amount: t.tone === 'out' ? -Math.abs(t.amount) : Math.abs(t.amount),
      atLabel: parseIsoDayLabel(t.day),
      tone: t.tone,
    })),
  ]), [finance.transactions]);

  const paymentIssues = useMemo(() => {
    return finance.paymentIssues.map(b => ({ id: b.id, label: b.label, value: b.value }));
  }, [finance.paymentIssues]);

  const histogram = useMemo(() => {
    return finance.histogram.map(h => ({ id: h.id, label: h.label, value: h.value }));
  }, [finance.histogram]);

  const presupuestos = useMemo(() => {
    const labelFor = (status: string) => {
      switch (status) {
        case 'PENDIENTE_VALIDACION':
          return 'Pendiente validación';
        case 'VALIDADO':
          return 'Validado';
        case 'ENVIADO':
          return 'Enviado';
        default:
          return status;
      }
    };

    return {
      counts: workflow.budgets.counts.map(c => ({ id: c.status, label: labelFor(c.status), value: c.count })),
      recent: workflow.budgets.recent.map(r => ({
        id: r.quoteNumber,
        label: r.customerName,
        estado: labelFor(r.status),
        total: r.total,
        fechaIso: r.createdAt,
      })),
    };
  }, [workflow.budgets.counts, workflow.budgets.recent]);

  const ordenes = useMemo(() => {
    const labelForStep = (step: string) => {
      switch (step) {
        case 'INBOX':
          return 'Bandeja';
        case 'REQUEST':
          return 'Solicitud';
        case 'BUDGET':
          return 'Presupuesto';
        case 'VALIDATION':
          return 'Validación';
        case 'DEV':
          return 'Diseño';
        case 'PROD':
          return 'Producción';
        case 'FINAL':
          return 'Final';
        default:
          return step;
      }
    };

    const byStep = workflow.orders.byStep.map(s => ({ id: s.step, label: labelForStep(s.step), value: s.count }));
    const recent = workflow.orders.recent.map(o => ({
      id: o.codigoOrden,
      codigo: o.codigoOrden,
      cliente: o.customerName,
      etapa: labelForStep(o.workflowStage),
      estado: o.status.replace(/_/g, ' ').toLowerCase(),
      fechaIso: o.createdAt,
      asignadoA: o.assignedUserName,
    }));

    return { byStep, recent };
  }, [workflow.orders.byStep, workflow.orders.recent]);

  return {
    incomeRange,
    expensesRange,
    onIncomeRangeChange: (next) => {
      setIncomeRange(next);
      setExpensesRange(next);
    },
    onExpensesRangeChange: (next) => {
      setExpensesRange(next);
      setIncomeRange(next);
    },
    income,
    expenses,
    incomeOverview,
    expensesOverview,
    tiles,
    trend,
    transactions,
    paymentIssues,
    histogram,
    presupuestos,
    ordenes,
    formatCurrency,
  };
};
