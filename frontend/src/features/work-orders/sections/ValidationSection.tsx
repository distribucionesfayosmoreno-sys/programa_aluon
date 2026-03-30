import { cardStyle, SectionTitle, StatusPill, Field, FieldLabel, uiColors } from '../components/ui';
import type { PendingBudget } from '../models';

export const ValidationSection = ({
  pendingBudgets,
  approverUserId,
  onApproverUserIdChange,
  onApproveBudget,
  highlightApprove,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
}: {
  pendingBudgets: PendingBudget[];
  approverUserId: string;
  onApproverUserIdChange: (value: string) => void;
  onApproveBudget: (validationId: string) => void;
  highlightApprove?: boolean;
  onAdvanceStep?: () => void;
  canAdvanceStep?: boolean;
  nextStepLabel?: string;
  advanceHint?: string;
}) => {
  const canApprove = Boolean(approverUserId.trim());

  return (
    <section className="p-6 rounded-2xl" style={cardStyle}>
      <SectionTitle n="03" label="Validación ptos" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-3 mb-4">
        <div>
          <FieldLabel>ID usuario gerente (ADMIN/DIOS)</FieldLabel>
          <Field
            value={approverUserId}
            onChange={e => onApproverUserIdChange(e.target.value)}
            placeholder="ID numérico del usuario"
          />
        </div>
        <div className="flex items-center gap-2">
          <StatusPill label={canApprove ? 'Listo para aprobar' : 'Falta ID'} ok={canApprove} />
        </div>
      </div>

      {pendingBudgets.length === 0 ? (
        <div className="text-sm" style={{ color: uiColors.textMuted }}>
          No hay presupuestos pendientes de validación.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: uiColors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>Presupuesto</th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>Cliente</th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>Modelo</th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>m²</th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>Total</th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${uiColors.border}` }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendingBudgets.map(budget => (
                <tr key={budget.requestId}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6', fontWeight: 700 }}>{budget.budgetNumber}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6' }}>{budget.customerName}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6' }}>{budget.modelLabel}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6' }}>{budget.m2}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6' }}>{budget.total} €</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f3f4f6' }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      disabled={!canApprove}
                      style={{
                        opacity: canApprove ? 1 : 0.4,
                        cursor: canApprove ? 'pointer' : 'not-allowed',
                        boxShadow: highlightApprove ? '0 0 0 3px var(--danger-bg)' : undefined,
                        border: highlightApprove ? '1px solid var(--danger)' : undefined,
                      }}
                      onClick={() => onApproveBudget(budget.validationId)}
                    >
                      Aprobar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
};
