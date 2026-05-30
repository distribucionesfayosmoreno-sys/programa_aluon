import { useState } from 'react';
import { DoorVisualSimulationActions, DoorVisualSimulationViewState } from '../DoorVisualSimulation.types';

type BudgetAssignerProps = {
  state: DoorVisualSimulationViewState;
  actions: DoorVisualSimulationActions;
};

// Mock data for demo purposes. This would be replaced by an API call
const MOCK_BUDGETS = [
  { id: 'b-1001', number: 'PRE-2026-001', customer: 'Juan Pérez' },
  { id: 'b-1002', number: 'PRE-2026-002', customer: 'Empresa Construcciones SL' },
  { id: 'b-1003', number: 'PRE-2026-003', customer: 'María Gómez' },
];

export const BudgetAssigner = ({ state, actions }: BudgetAssignerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Simple mock search filter
  const filteredBudgets = MOCK_BUDGETS.filter(
    b => b.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
         b.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBudget = MOCK_BUDGETS.find(b => b.id === state.selectedBudgetId);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call to save simulation
    setTimeout(() => {
      setSaving(false);
      alert('Simulación guardada con éxito.');
    }, 1000);
  };

  const handleAssign = () => {
    setSaving(true);
    // Simulate API call to assign
    setTimeout(() => {
      setSaving(false);
      alert(`Simulación asignada al presupuesto ${selectedBudget?.number}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }, 1000);
  };

  return (
    <div className="mt-4 pt-4 border-t border-dashed" style={{ borderColor: '#e8eaed' }}>
      {!isSearchOpen ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !state.resultImageUrl}
            className="flex-1 btn-secondary py-3 rounded-xl text-sm font-black tracking-widest disabled:opacity-50"
          >
            {saving ? '...' : 'GUARDAR'}
          </button>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            disabled={!state.resultImageUrl}
            className="flex-1 btn-primary py-3 rounded-xl text-sm font-black tracking-widest disabled:opacity-50"
          >
            ASIGNAR A PRESUPUESTO
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
              Buscar Presupuesto o Cliente
            </label>
            <button 
              onClick={() => { setIsSearchOpen(false); actions.setSelectedBudgetId(null); }}
              className="text-xs font-bold text-gray-400 hover:text-gray-700"
            >
              CANCELAR
            </button>
          </div>
          
          <input
            type="text"
            className="w-full text-sm font-semibold rounded-xl border px-4 py-3 bg-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            style={{ borderColor: '#e8eaed', color: '#24292f' }}
            placeholder="Ej: PRE-2026-001 o Juan Pérez..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {searchTerm.length > 0 && (
            <div className="border rounded-xl bg-white overflow-hidden" style={{ borderColor: '#e8eaed' }}>
              {filteredBudgets.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {filteredBudgets.map(b => (
                    <li key={b.id}>
                      <button
                        onClick={() => actions.setSelectedBudgetId(b.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center ${state.selectedBudgetId === b.id ? 'bg-[var(--color-primary)]/10' : ''}`}
                      >
                        <div>
                          <div className="text-sm font-bold" style={{ color: '#0d1117' }}>{b.number}</div>
                          <div className="text-xs font-semibold" style={{ color: '#57606a' }}>{b.customer}</div>
                        </div>
                        {state.selectedBudgetId === b.id && (
                          <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-center text-gray-500">
                  No se encontraron resultados.
                </div>
              )}
            </div>
          )}

          {state.selectedBudgetId && (
            <button
              type="button"
              onClick={handleAssign}
              disabled={saving}
              className="w-full btn-primary py-3 rounded-xl text-sm font-black tracking-widest mt-4"
            >
              {saving ? 'VINCULANDO...' : 'CONFIRMAR ASIGNACIÓN'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
