import React from 'react';
import { StatusPill } from '../components/ui';

export const SidebarWorkflow = ({
  customerReady,
  budgetGenerated,
  accountingApproved,
  adminApproved,
  developmentGenerated,
  cutlistGenerated,
  productionReady,
  finalized,
  ready,
}: {
  customerReady: boolean;
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  developmentGenerated: boolean;
  cutlistGenerated: boolean;
  productionReady: boolean;
  finalized: boolean;
  ready: boolean;
}) => (
  <div className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
    <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
      Estado del workflow
    </div>
    <div className="mt-4 space-y-2">
      <StatusPill label="Solicitud completa" ok={customerReady} />
      <StatusPill label="Presupuesto generado" ok={budgetGenerated} />
      <StatusPill label="Contabilidad" ok={accountingApproved} />
      <StatusPill label="Admin/Dios" ok={adminApproved} />
      <StatusPill label="Desarrollo" ok={developmentGenerated} />
      <StatusPill label="Despiece" ok={cutlistGenerated} />
      <StatusPill label="Producción" ok={productionReady} />
      <StatusPill label="Finalizado" ok={finalized} />
      <StatusPill label="Listo" ok={ready} />
    </div>
  </div>
);
