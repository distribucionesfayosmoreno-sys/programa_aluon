import { DoorVisualSimulationActions, DoorVisualSimulationViewState } from '../DoorVisualSimulation.types';

type DoorConfiguratorProps = {
  state: DoorVisualSimulationViewState;
  actions: DoorVisualSimulationActions;
};

const MODELS = [
  { id: 'Classic', label: 'Clásico', icon: '🏛️' },
  { id: 'Inox', label: 'Inox', icon: '✨' },
  { id: 'Minimalist', label: 'Minimalista', icon: '🔲' },
  { id: 'Rustic', label: 'Rústica', icon: '🪵' }
];

const TYPES = [
  { id: 'Single Leaf', label: '1 Hoja' },
  { id: 'Double Leaf', label: '2 Hojas' },
  { id: 'Pivot', label: 'Pivotante' },
  { id: 'Sliding', label: 'Corredera' }
];

const COLORS = [
  { id: 'White', label: 'Blanco', hex: '#FFFFFF' },
  { id: 'Black', label: 'Negro', hex: '#111111' },
  { id: 'Wood', label: 'Madera', hex: '#8B5A2B' },
  { id: 'Anthracite', label: 'Gris Antracita', hex: '#383E42' }
];

export const DoorConfigurator = ({ state, actions }: DoorConfiguratorProps) => {
  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-2">
      <div>
        <label className="text-xs font-black uppercase tracking-widest block mb-3" style={{ color: '#8b949e' }}>
          Modelo de Puerta
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => actions.setDoorModel(m.id)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                state.doorModel === m.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm'
                  : 'border-[#e8eaed] bg-white text-[#57606a] hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-xs font-bold">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest block mb-3" style={{ color: '#8b949e' }}>
          Tipo de Apertura
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => actions.setDoorType(t.id)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                state.doorType === t.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md'
                  : 'border-[#e8eaed] bg-white text-[#57606a] hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest block mb-3" style={{ color: '#8b949e' }}>
          Color / Acabado
        </label>
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map(c => (
            <button
              key={c.id}
              title={c.label}
              onClick={() => actions.setDoorColor(c.id)}
              className={`w-full aspect-square rounded-full border-2 transition-all mx-auto max-w-[48px] ${
                state.doorColor === c.id
                  ? 'border-[var(--color-primary)] scale-110 shadow-md ring-2 ring-offset-2 ring-[var(--color-primary)]/50'
                  : 'border-[#e8eaed] hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        {state.doorColor && (
          <p className="text-xs text-center mt-2 font-semibold" style={{ color: '#57606a' }}>
            {COLORS.find(c => c.id === state.doorColor)?.label}
          </p>
        )}
      </div>
      
      {/* Opcional: mostrar el prompt generado para que el usuario pueda ajustarlo si quiere */}
      <div className="pt-4 border-t border-dashed" style={{ borderColor: '#e8eaed' }}>
        <label className="text-xs font-black uppercase tracking-widest flex items-center justify-between mb-2" style={{ color: '#8b949e' }}>
          <span>Ajuste Manual (Prompt)</span>
        </label>
        <textarea
          className="w-full text-sm font-semibold rounded-xl border px-3 py-2 bg-gray-50 focus:bg-white transition-colors"
          style={{
            borderColor: '#e8eaed',
            color: '#24292f',
            resize: 'none',
          }}
          rows={3}
          value={state.prompt}
          onChange={e => actions.setPrompt(e.target.value)}
          placeholder="Ej: puerta blanca de dos hojas estilo clásico..."
        />
      </div>
    </div>
  );
};
