import { cardStyle, Field, FieldLabel, SectionTitle, StatusPill, uiColors } from '../components/ui';

export const BudgetSection = ({
  pricePerM2,
  total,
  canGenerateBudget,
  budgetGenerated,
  accountingApproved,
  adminApproved,
  validationError,
  onGenerateBudget,
  onToggleAccounting,
  highlightGenerate,
  highlightAccounting,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
}: {
  pricePerM2: number;
  total: number;
  canGenerateBudget: boolean;
  budgetGenerated: boolean;
  accountingApproved: boolean;
  adminApproved: boolean;
  validationError: string;
  onGenerateBudget: () => void;
  onToggleAccounting: () => void;
  highlightGenerate?: boolean;
  highlightAccounting?: boolean;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
}) => (
  <section className="p-6 rounded-2xl" style={cardStyle}>
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
          style={{
            opacity: canGenerateBudget ? 1 : 0.5,
            cursor: canGenerateBudget ? 'pointer' : 'not-allowed',
            boxShadow: highlightGenerate ? '0 0 0 3px var(--danger-bg)' : undefined,
            border: highlightGenerate ? '1px solid var(--danger)' : undefined,
          }}
        >
          Generar presupuesto
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-4">
      <StatusPill label="Presupuesto generado" ok={budgetGenerated} />
      <StatusPill label="Confirmado contabilidad" ok={accountingApproved} />
      <StatusPill label="Validación ptos" ok={adminApproved} />
    </div>
    <div className="flex items-center gap-3 mt-4">
      <button
        type="button"
        className="btn-ghost"
        onClick={onToggleAccounting}
        disabled={!budgetGenerated}
        style={{
          opacity: budgetGenerated ? 1 : 0.5,
          cursor: budgetGenerated ? 'pointer' : 'not-allowed',
          boxShadow: highlightAccounting ? '0 0 0 3px var(--danger-bg)' : undefined,
          border: highlightAccounting ? '1px solid var(--danger)' : undefined,
        }}
      >
        Confirmar (Contabilidad)
      </button>
    </div>
    {validationError && (
      <div className="text-xs font-semibold mt-3" style={{ color: uiColors.dangerDark }}>
        {validationError}
      </div>
    )}
    {onAdvanceStep && (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onAdvanceStep}
          disabled={!canAdvanceStep}
          style={{ opacity: canAdvanceStep ? 1 : 0.5, cursor: canAdvanceStep ? 'pointer' : 'not-allowed' }}
          title={advanceHint || undefined}
        >
          <span className="text-base">➡️</span>
          Avanzar etapa{nextStepLabel ? ` · ${nextStepLabel}` : ''}
        </button>
        {advanceHint && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: uiColors.textGhost }}>
            {advanceHint}
          </span>
        )}
      </div>
    )}
  </section>
);
