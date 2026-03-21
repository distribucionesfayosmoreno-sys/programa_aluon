import React from 'react';
import { StatusPill } from '../components/ui';

export const SidebarSummary = ({
  customerName,
  modelLabel,
  m2,
  total,
  budgetGenerated,
  accountingApproved,
  adminApproved,
  googleView,
}: {
  customerName: string;
  modelLabel: string;
  m2: number;
  total: number;
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  googleView: boolean;
}) => (
  <div className="p-6 rounded-2xl" style={{ background: '#0d1117', color: '#ffffff', boxShadow: '0 20px 50px rgba(13,17,23,0.35)' }}>
    <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
      Resumen del pedido
    </div>
    <div className="mt-4 space-y-3">
      <div>
        <div className="text-xs" style={{ color: '#8b949e' }}>Cliente</div>
        <div className="text-sm font-bold">
          {customerName}
        </div>
      </div>
      <div>
        <div className="text-xs" style={{ color: '#8b949e' }}>Modelo</div>
        <div className="text-sm font-bold">{modelLabel}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs" style={{ color: '#8b949e' }}>m²</div>
          <div className="text-sm font-bold">{m2 || '—'}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#8b949e' }}>Total</div>
          <div className="text-sm font-bold">{total} €</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusPill label="Presupuesto" ok={budgetGenerated} />
        <StatusPill label="Aprobado" ok={accountingApproved && adminApproved} />
      </div>
      <div className="pt-2 text-xs" style={{ color: '#8b949e' }}>
        {googleView ? 'Incluye visualización Google.' : 'Sin visualización Google.'}
      </div>
    </div>
  </div>
);
