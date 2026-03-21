import { uiColors } from './ui';

type WorkOrdersHeaderProps = {
  overallPct: number;
  onOpenNewRequest: () => void;
  onResetDownstream: () => void;
};

export const WorkOrdersHeader = ({ overallPct, onOpenNewRequest, onResetDownstream }: WorkOrdersHeaderProps) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <div>
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-5 rounded-full bg-brand" />
        <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: uiColors.textPrimary }}>
          Órdenes de trabajo
        </h1>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide ml-3.5 mt-0.5" style={{ color: uiColors.textGhost }}>
        Workflow · Presupuestos · Producción
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f8f9fb', border: `1px solid ${uiColors.border}` }}>
        <div className="h-2 w-24 rounded-full" style={{ background: uiColors.border, overflow: 'hidden' }}>
          <div className="h-full" style={{ width: `${overallPct}%`, background: uiColors.accent }} />
        </div>
        <span className="text-xs font-bold" style={{ color: uiColors.textSubtle }}>{overallPct}%</span>
      </div>
      <button className="btn-primary" onClick={onOpenNewRequest}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva orden
      </button>
      <button className="btn-ghost" onClick={onResetDownstream}>Reiniciar flujo</button>
    </div>
  </div>
);
