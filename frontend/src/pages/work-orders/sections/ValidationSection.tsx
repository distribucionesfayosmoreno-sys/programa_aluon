import { SectionTitle, StatusPill, Field, FieldLabel } from '../components/ui';
import type { PendingBudget } from '../models';

export const ValidationSection = ({
  pendingBudgets,
  approverUserId,
  onApproverUserIdChange,
  onApproveBudget,
  error,
}: {
  pendingBudgets: PendingBudget[];
  approverUserId: string;
  onApproverUserIdChange: (value: string) => void;
  onApproveBudget: (validationId: string) => void;
  error: string;
}) => {
  const canApprove = Boolean(approverUserId.trim());

  return (
    <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <SectionTitle n="03" label="Validación ptos" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-3 mb-4">
        <div>
          <FieldLabel>ID usuario gerente (ADMIN/DIOS)</FieldLabel>
          <Field
            value={approverUserId}
            onChange={e => onApproverUserIdChange(e.target.value)}
            placeholder="UUID del usuario"
          />
        </div>
        <div className="flex items-center gap-2">
          <StatusPill label={canApprove ? 'Listo para aprobar' : 'Falta ID'} ok={canApprove} />
        </div>
      </div>

      {pendingBudgets.length === 0 ? (
        <div className="text-sm" style={{ color: '#6b7280' }}>
          No hay presupuestos pendientes de validación.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>Presupuesto</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>Cliente</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>Modelo</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>m²</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>Total</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e8eaed' }}>Acción</th>
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
                      style={{ opacity: canApprove ? 1 : 0.4, cursor: canApprove ? 'pointer' : 'not-allowed' }}
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
      {error && (
        <div className="text-xs font-semibold mt-3" style={{ color: '#b42318' }}>
          {error}
        </div>
      )}
    </section>
  );
};
