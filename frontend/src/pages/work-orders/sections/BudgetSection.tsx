import React from 'react';
import { Field, FieldLabel, SectionTitle, StatusPill } from '../components/ui';

export const BudgetSection = ({
  pricePerM2,
  total,
  canGenerateBudget,
  budgetGenerated,
  accountingApproved,
  adminApproved,
  onGenerateBudget,
  onToggleAccounting,
  onToggleAdmin,
}: {
  pricePerM2: number;
  total: number;
  canGenerateBudget: boolean;
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  onGenerateBudget: () => void;
  onToggleAccounting: () => void;
  onToggleAdmin: () => void;
}) => (
  <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <SectionTitle n="02" label="Presupuesto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <FieldLabel>Precio €/m²</FieldLabel>
        <Field value={pricePerM2} readOnly />
      </div>
      <div>
        <FieldLabel>Total estimado</FieldLabel>
        <Field value={`${total} €`} readOnly />
      </div>
      <div className="flex items-end">
        <button
          type="button"
          className="btn-primary w-full justify-center"
          onClick={onGenerateBudget}
          disabled={!canGenerateBudget}
          style={{ opacity: canGenerateBudget ? 1 : 0.5, cursor: canGenerateBudget ? 'pointer' : 'not-allowed' }}
        >
          Generar presupuesto
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-4">
      <StatusPill label="Presupuesto generado" ok={budgetGenerated} />
      <StatusPill label="Confirmado contabilidad" ok={accountingApproved} />
      <StatusPill label="Autorizado superior" ok={adminApproved} />
    </div>
    <div className="flex items-center gap-3 mt-4">
      <button
        type="button"
        className="btn-ghost"
        onClick={onToggleAccounting}
        disabled={!budgetGenerated}
        style={{ opacity: budgetGenerated ? 1 : 0.5, cursor: budgetGenerated ? 'pointer' : 'not-allowed' }}
      >
        Confirmar (Contabilidad)
      </button>
      <button
        type="button"
        className="btn-ghost"
        onClick={onToggleAdmin}
        disabled={!budgetGenerated}
        style={{ opacity: budgetGenerated ? 1 : 0.5, cursor: budgetGenerated ? 'pointer' : 'not-allowed' }}
      >
        Autorizar (Admin/Dios)
      </button>
    </div>
  </section>
);
